import { localStorage } from '../../helpers/localStorage/actions';
import { TenantType } from '../../types/crmAthan/tenants';
import { CampaignItemType, PayloadCampaignType } from '../../types/dialer/campaigns';
import { ThrowAlertType } from '../../types/snackbar';
import { date } from '../../helpers/date';
import { LabelValueType } from '../../types/common';
import { LocalStorageItemType } from '../localStorage/LocalStorageItemType';

const dataString = localStorage.get(LocalStorageItemType.ATHAN_TENANT_CRM_DATA);
const tenant: TenantType = dataString ? JSON.parse(dataString) : '';

export const campaign = {
  modelShot: () => {
      return [
        { label: 'Padrão', value: '0' },
        { label: 'Bloco',  value: '1' }
      ]
  },
  hosts: () => {
    return [
      { label: 'Twilio', value: '1' }
    ]
  },
  channels: () => {
    return [
      { label: 'WhatsApp', value: 'whatsapp' },
      { label: 'Ligação',  value: 'call' }
    ]
  },
  attendances: () => {
    const attendance: LabelValueType[] = [
      {
        label: 'Humano',
        value: 'human'
      }
    ];

    if(tenant.ia_status) {
      attendance.push({
        label: 'CobrecomAI',
        value: 'cobrecomAI'
      })
    }

    return attendance;
  },
  dayOff: () => {
    return [
      { label: 'Domingo', value: '0' },
      { label: 'Segunda-feira', value: '1' },
      { label: 'Terça-feira', value: '2' },
      { label: 'Quarta-feira', value: '3' },
      { label: 'Quinta-feira', value: '4' },
      { label: 'Sexta-feira', value: '5' },
      { label: 'Sábado', value: '6' }
    ]
  },
  checkPayload: (payload: PayloadCampaignType, throwAlert: ThrowAlertType) => {
    if(!payload?.campaign?.name) return throwAlert('error', 'Nome obrigatório!');
    if(!payload?.config?.start_date || !payload?.campaign?.last_triggered_date) return throwAlert('error', 'Datas obrigatórias!');        
    if(payload?.campaign?.partition as number > 0 && !payload?.campaign?.partition_part) return throwAlert('error', 'Quantidade de disparos obrigatório!');
    if(!payload?.config?.type) return throwAlert('error', 'Canal obrigatório!');
    if(payload?.config?.type === 'whatsapp' && !payload?.config?.template_id) return throwAlert('error', 'Template obrigatório!');
    if(payload?.config?.attendanceType === 'cobrecomAI' && !payload?.config?.attendance) return throwAlert('error', 'Robô obrigatório!');
    if(!payload?.config?.agressiveness) return throwAlert('error', 'Agressividade obrigatória!');
    if(parseInt(payload?.config?.agressiveness) <= 0) return throwAlert('error', 'Agressividade deve ser maior que 0!');

    delete payload.config.attendanceType;

    return true;
  },
  formatDataInPayloadCampaign: (payload: CampaignItemType) => {    
    const newPayload: PayloadCampaignType = {
      campaign: {
        id: payload.id,
        last_triggered_date: payload.last_triggered_date ? date.splitTDateISOString(payload.last_triggered_date) : '',
        name: payload.name,
        partition: payload.partition,
        music_on_hold: payload.music_on_hold,
        partition_part: payload.partition_part,
        ruler: payload.ruler.toString(),
        status: payload.status,
        subject: payload.subject                     
      },
      config: {
        agressiveness: payload?.Config?.agressiveness.toString(),
        attendance: payload?.Config?.attendance,
        day_off: payload?.Config?.day_off,
        host: payload?.Config?.host, 
        id: payload?.Config?.id,
        start_date: payload?.Config?.start_date ? date.splitTDateISOString(payload?.Config?.start_date) : '',
        type: payload?.Config?.type,
        tries_by_phone: payload?.Config?.tries_by_phone ? parseInt(payload?.Config?.tries_by_phone) : null,
        template_email_id: payload?.Config?.template_email_id || null,
        template_id: payload?.Config?.template_id || null,
        template_sms_id: payload?.Config?.template_sms_id || null,
        zenvia_template_id: payload?.Config?.zenvia_template_id || null,
        attendanceType: payload?.Config?.attendance ? 'cobrecomAI' : 'human'
      }
    };    

    return newPayload;
  },
  recurrenceTypes: (typeCampaign: string) => {
    let recurrencesType: LabelValueType[] = [];

    switch(typeCampaign) {
      case 'whatsapp':
        recurrencesType = [
          { label: 'Única', value: 'full' },
          { label: 'Não lido', value: 'no-read' }
        ];
        break;
      case 'call':
        recurrencesType = [
          { label: 'Única', value: 'full' },
          { label: 'Ocupado', value: 'busy' },
          { label: 'Cancelado', value: 'canceled' },
          { label: 'Falha', value: 'failed' },
          { label: 'Não antendido', value: 'no-answer' }
        ];
        break;
    }

    return recurrencesType;
  }
}