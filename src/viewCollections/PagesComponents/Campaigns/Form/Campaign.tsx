import * as MUI from '@mui/material';
import * as MUIIcon from '@mui/icons-material';
import * as S from './styled';
import { SimpleTitle } from '../../../commonStyled';
import { CustomInput } from '../../../../components/Custom/CustomInput';
import { CustomButton } from '../../../../components/Custom/CustomButton';
import { CustomSelect } from '../../../../components/Custom/CustomSelect';
import { campaign } from '../../../../helpers/dialer/campaign';
import { Dispatch } from 'react';
import { PayloadCampaignType } from '../../../../types/dialer/campaigns';
import { CobrecomRobotType } from '../../../../types/dialer/cobrecomAI';
import { CustomCheckbox } from '../../../../components/Custom/CustomCheckbox';
import { CustomTextarea } from '../../../../components/Custom/CustomTextarea';
import { TemplateType } from '../../../../types/dialer/templates';
import Smartphone from '../../../../assets/images/webp/smartphone.webp';

type Props = {
    setPayloadCampaign: Dispatch<PayloadCampaignType>;
    payloadCampaign: PayloadCampaignType | undefined;
    robot: CobrecomRobotType[];
    templatesList: TemplateType[];
    handleCampaign: () => Promise<void>;
    campaignId: string;
    handleStep: (step: number) => void;
}

export const Campaign = ({ handleStep, setPayloadCampaign, campaignId, handleCampaign, payloadCampaign, robot, templatesList }: Props) => {
    return (
        <MUI.Box>
            <MUI.Stack direction="row" gap="10px">
                <MUI.Box>
                    <SimpleTitle>Informações da campanha</SimpleTitle>
                    <MUI.Stack direction="row" flexWrap="wrap" gap="10px">
                        <CustomInput
                            label="Nome"
                            placeholder="Nome"
                            type="text"
                            height="36px"
                            required
                            Icon={MUIIcon.TextFields}
                            value={payloadCampaign?.campaign?.name}
                            onChange={(e) => setPayloadCampaign({ 
                                ...payloadCampaign, 
                                campaign: { 
                                    ...payloadCampaign?.campaign,
                                    name: e.target.value 
                                } 
                            })}
                        />
                        <CustomInput
                            label="Data de ínicio"
                            placeholder="Data de ínicio"
                            type="date"                    
                            height="36px"
                            required
                            Icon={MUIIcon.CalendarToday}
                            value={payloadCampaign?.config?.start_date}
                            onChange={(e) => setPayloadCampaign({ 
                                ...payloadCampaign, 
                                config: { 
                                    ...payloadCampaign?.config,
                                    start_date: e.target.value 
                                } 
                            })}
                        />                      
                        {/* <CustomSelect
                            label="Ferramenta de disparo"
                            placeholder="Ferramenta de disparo"
                            height="36px"
                            required
                            Icon={MUIIcon.Build}
                            options={campaign.hosts().map(option => {
                                return {
                                    label: option.label,
                                    value: option.value
                                }
                            })}
                            value={payloadCampaign?.config?.host?.toString()}
                            setValue={(e) => setPayloadCampaign({ 
                                ...payloadCampaign, 
                                config: { 
                                    ...payloadCampaign?.config,
                                    host: parseInt(e) 
                                } 
                            })}
                        /> */}
                        <CustomSelect
                            label="Modelo de disparo"
                            placeholder="Modelo de disparo"
                            height="36px"
                            required
                            Icon={MUIIcon.GridView}
                            options={campaign.modelShot().map(option => {
                                return {
                                    label: option.label,
                                    value: option.value
                                }
                            })}
                            value={payloadCampaign?.campaign?.partition?.toString()}
                            setValue={(e) => setPayloadCampaign({ 
                                ...payloadCampaign, 
                                campaign: { 
                                    ...payloadCampaign?.campaign,
                                    partition: parseInt(e) 
                                } 
                            })}
                        />
                        {payloadCampaign?.campaign?.partition === 1 &&
                            <CustomInput
                                label="Quantidade de disparos"
                                placeholder="Quantidade de disparos"
                                type="text"                 
                                height="36px"  
                                required     
                                Icon={MUIIcon.Numbers}
                                value={payloadCampaign?.campaign?.partition_part?.toString()}
                                onChange={(e) => setPayloadCampaign({ 
                                    ...payloadCampaign, 
                                    campaign: { 
                                        ...payloadCampaign?.campaign,
                                        partition_part: parseInt(e.target.value) 
                                    } 
                                })}
                            />
                        }
                    </MUI.Stack>
                    <SimpleTitle>Informações da campanha</SimpleTitle>
                    <MUI.Stack direction="row" flexWrap="wrap" gap="10px">
                        <CustomSelect
                            label="Canal"
                            placeholder="Canal"
                            height="36px"
                            required
                            Icon={MUIIcon.PhonelinkSetup}
                            options={campaign.channels().map(option => {
                                return {
                                    label: option.label,
                                    value: option.value
                                }
                            })}
                            value={payloadCampaign?.config?.type}
                            setValue={(e) => setPayloadCampaign({ 
                                ...payloadCampaign, 
                                config: { 
                                    ...payloadCampaign?.config,
                                    type: e 
                                } 
                            })}
                        />
                        {payloadCampaign?.config?.type === 'whatsapp' &&
                            <CustomSelect
                                label="Template"
                                placeholder="Template"
                                height="36px"   
                                required
                                Icon={MUIIcon.WhatsApp}               
                                options={templatesList.map(option => {
                                    return {
                                        label: option.name,
                                        value: option.id.toString()
                                    }
                                })}
                                value={payloadCampaign?.config?.template_id?.toString()}
                                setValue={(e) => setPayloadCampaign({ 
                                    ...payloadCampaign, 
                                    config: { 
                                        ...payloadCampaign?.config,
                                        template_id: parseInt(e) 
                                    } 
                                })}
                            />                
                        }
                        <CustomInput
                            label="Data de expiração"
                            placeholder="Data de expiração"
                            type="date"  
                            height="36px"    
                            required              
                            Icon={MUIIcon.CalendarToday}
                            value={payloadCampaign?.campaign?.last_triggered_date}
                            onChange={(e) => setPayloadCampaign({ 
                                ...payloadCampaign, 
                                campaign: { 
                                    ...payloadCampaign?.campaign,
                                    last_triggered_date: e.target.value 
                                } 
                            })}
                        />                
                        <CustomSelect
                            label="Atendente"
                            placeholder="Atendente"
                            height="36px"  
                            required       
                            Icon={MUIIcon.SupportAgent}                        
                            options={campaign.attendances().map(option => {
                                return {
                                    label: option.label,
                                    value: option.value
                                }
                            })}
                            value={payloadCampaign?.config?.attendanceType}
                            setValue={(e) => setPayloadCampaign({ 
                                ...payloadCampaign, 
                                config: { 
                                    ...payloadCampaign?.config,
                                    attendanceType: e 
                                } 
                            })}
                        />                
                        {payloadCampaign?.config?.attendanceType === 'cobrecomAI' &&
                            <CustomSelect
                                label="Robô"
                                placeholder="Robô"
                                height="36px" 
                                required
                                Icon={MUIIcon.SmartToy}                     
                                options={robot.map(option => {
                                    return {
                                        label: option.bot_name,
                                        value: option.id.toString()
                                    }
                                })}
                                value={payloadCampaign?.config?.attendance?.toString()}
                                setValue={(e) => setPayloadCampaign({ 
                                    ...payloadCampaign, 
                                    config: { 
                                        ...payloadCampaign?.config,
                                        attendance: parseInt(e) 
                                    } 
                                })}
                            />                
                        }
                        <CustomInput
                            label="Agressividade"
                            placeholder="Agressividade"
                            type="text"  
                            height="36px"     
                            required             
                            Icon={MUIIcon.FlashOn}
                            value={payloadCampaign?.config?.agressiveness}
                            onChange={(e) => setPayloadCampaign({ 
                                ...payloadCampaign, 
                                config: { 
                                    ...payloadCampaign?.config,
                                    agressiveness: e.target.value 
                                } 
                            })}
                        />
                        <CustomInput
                            label="Tentativas por telefóne"
                            placeholder="Tentativas por telefóne"
                            type="text"  
                            height="36px"                  
                            Icon={MUIIcon.Pin}
                            value={payloadCampaign?.config?.tries_by_phone?.toString()}
                            onChange={(e) => setPayloadCampaign({ 
                                ...payloadCampaign, 
                                config: { 
                                    ...payloadCampaign?.config,
                                    tries_by_phone: parseInt(e.target.value) 
                                } 
                            })}
                        />
                    </MUI.Stack>
                    <MUI.Stack direction="row" flexWrap="wrap" gap="10px">
                        <CustomCheckbox
                            title="Folga"
                            options={campaign.dayOff().map(option => {
                                return {
                                    label: option.label,
                                    value: option.value
                                }
                            })}
                            value={payloadCampaign?.config?.day_off?.map(item => item.toString()) || []}
                            setValue={(e) => setPayloadCampaign({ 
                                ...payloadCampaign, 
                                config: { 
                                    ...payloadCampaign?.config,
                                    day_off: e.map(item => parseInt(item))
                                } 
                            })}
                        />
                        {payloadCampaign?.config?.type === 'call' &&
                            <CustomTextarea     
                                Icon={MUIIcon.RecordVoiceOver}               
                                value={payloadCampaign?.campaign?.music_on_hold}
                                setValue={(e) => setPayloadCampaign({ 
                                    ...payloadCampaign, 
                                    campaign: { 
                                        ...payloadCampaign?.campaign,
                                        music_on_hold: e.target.value
                                    } 
                                })}
                                label="Saudação"
                                placeholder="Saudação"
                            />
                        }
                    </MUI.Stack>                
                </MUI.Box>
                {payloadCampaign?.config?.type === 'whatsapp' &&
                    <MUI.Box>
                        <SimpleTitle>Template</SimpleTitle>
                        <MUI.Stack position="relative" direction="column" alignItems="center">
                            <S.Img src={Smartphone} />
                            <S.TextTemplate>
                                {templatesList?.filter(template => template.id === payloadCampaign?.config?.template_id)[0]?.content || ''}
                            </S.TextTemplate>
                        </MUI.Stack>
                    </MUI.Box>            
                }
            </MUI.Stack>       
            <MUI.Stack marginTop="20px" direction="row" justifyContent="space-between">
                <CustomButton
                    value={
                        campaignId
                        ? 'Editar campanha'
                        : 'Criar campanha'
                    }
                    Icon={MUIIcon.Campaign}
                    onClick={handleCampaign}                      
                    width="auto"
                />
                {(!!campaignId || !!payloadCampaign?.campaign?.id) &&
                    <CustomButton
                        value="Pular passo"
                        Icon={MUIIcon.SkipNext}
                        onClick={() => handleStep(1)}                                        
                        width="auto"
                    />
                }
            </MUI.Stack>
        </MUI.Box>
    )
}