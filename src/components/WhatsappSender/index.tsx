import React, { useState, useEffect } from 'react';
import * as MUI from '@mui/material';
import * as MUIIcon from '@mui/icons-material';
import { Manager } from '@twilio/flex-ui';
import { CustomInput } from '../Custom/CustomInput';
import { CustomSelect } from '../Custom/CustomSelect';
import { CustomButton } from '../Custom/CustomButton';
import { serviceContent } from '../../services/content';
import { useSnackbar } from '../../hooks/useSnackbar';
import { parsePhoneNumber } from 'libphonenumber-js';

interface ContentTemplate {
  sid: string;
  name: string;
  language: string;
  types: {
    [key: string]: {
      body: string;
    };
  };
  variables?: {
    [key: string]: string;
  };
}

interface WhatsappSenderProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface GetSendersResponse {
  addresses: any[];
}

export const WhatsappSender: React.FC<WhatsappSenderProps> = ({ isOpen, onToggle }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null);
  const [templates, setTemplates] = useState<ContentTemplate[]>([]);
  const [senders, setSenders] = useState<any[]>([]);
  const [selectedSender, setSelectedSender] = useState('');
  const [variables, setVariables] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const { throwAlert } = useSnackbar();

  const manager = Manager.getInstance();

  // Get the Twilio Flex theme background color
  const getTwilioBackgroundColor = () => {
    const flexTheme = manager.configuration.theme as any;
    return flexTheme?.colors?.companySecondaryColor || 'background.paper';
  };

  useEffect(() => {
    if (isOpen) {
      loadTemplates();
      loadSenders();
    }
  }, [isOpen]);

  const loadTemplates = async () => {
    setTemplatesLoading(true);
    try {
      const response = await serviceContent.get();
      if (response?.contents) {
        setTemplates(response.contents as any);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
      throwAlert('error', 'Erro ao carregar templates');
    } finally {
      setTemplatesLoading(false);
    }
  };

  const loadSenders = async () => {
    try {
      const response = await serviceContent.getSenders() as GetSendersResponse;
      if (response?.addresses) {
        const whatsappSenders = (response as GetSendersResponse).addresses.filter(
          (sender: any) => sender.type === 'whatsapp'
        );
        setSenders(whatsappSenders);
        if (whatsappSenders.length > 0) {
          setSelectedSender(whatsappSenders[0].sid);
        }
      }
    } catch (error) {
      console.error('Error loading senders:', error);
      throwAlert('error', 'Erro ao carregar remetentes');
    }
  };

  const handleTemplateChange = (templateSid: string) => {
    const template = templates.find(t => t.sid === templateSid);
    setSelectedTemplate(template || null);
    
    // Reset variables when template changes
    if (template?.variables) {
      const initialVariables: { [key: string]: string } = {};
      Object.keys(template.variables).forEach(key => {
        initialVariables[key] = '';
      });
      setVariables(initialVariables);
    } else {
      setVariables({});
    }
  };

  const handleVariableChange = (key: string, value: string) => {
    setVariables(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const validatePhoneNumber = (phone: string): boolean => {
    try {
      const parsed = parsePhoneNumber(phone, 'BR');
      return parsed.isValid();
    } catch {
      return false;
    }
  };

  const formatPhoneNumber = (phone: string): string => {
    try {
      const parsed = parsePhoneNumber(phone, 'BR');
      return parsed.format('E.164').replace('+', '');
    } catch {
      return phone.replace(/\D/g, '');
    }
  };

  const handleSend = async () => {
    if (!phoneNumber.trim()) {
      throwAlert('error', 'Digite um número de telefone');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      throwAlert('error', 'Número de telefone inválido');
      return;
    }

    if (!selectedTemplate) {
      throwAlert('error', 'Selecione um template');
      return;
    }

    if (!selectedSender) {
      throwAlert('error', 'Selecione um remetente');
      return;
    }

    // Check if all required variables are filled
    if (selectedTemplate.variables) {
      const missingVariables = Object.keys(selectedTemplate.variables).filter(
        key => !variables[key] || variables[key].trim() === ''
      );
      
      if (missingVariables.length > 0) {
        throwAlert('error', `Preencha todas as variáveis: ${missingVariables.join(', ')}`);
        return;
      }
    }

    setLoading(true);
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      const sender = senders.find(s => s.sid === selectedSender);
      
      const response = await serviceContent.sendContentTemplate({
        content_sid: selectedTemplate.sid,
        to: formattedPhone,
        from: sender?.address || selectedSender,
        variables
      });

      if (response?.sid) {
        throwAlert('success', 'Mensagem enviada com sucesso!');
        setPhoneNumber('');
        setSelectedTemplate(null);
        setVariables({});
      } else {
        throwAlert('error', 'Erro ao enviar mensagem');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      throwAlert('error', 'Erro ao enviar mensagem');
    } finally {
      setLoading(false);
    }
  };

  const templateOptions = templates.map(template => ({
    label: template.name,
    value: template.sid
  }));

  const senderOptions = senders.map(sender => ({
    label: sender.friendly_name || sender.address,
    value: sender.sid
  }));

  if (!isOpen) {
    return null;
  }

  return (
    <MUI.Box
      sx={{
        backgroundColor: getTwilioBackgroundColor(),
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        p: 2,
        mb: 2,
        boxShadow: 1
      }}
    >
      <MUI.Stack spacing={2}>
        <MUI.Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MUIIcon.WhatsApp color="success" />
          <MUI.Typography variant="h6">Enviar WhatsApp</MUI.Typography>
        </MUI.Box>

        <CustomInput
          label="Número de telefone"
          placeholder="Digite o número (ex: 11999999999)"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          Icon={MUIIcon.Phone}
          required
          type="text"
        />

        <CustomSelect
          label="Template"
          placeholder="Selecione um template"
          value={selectedTemplate?.sid || ''}
          setValue={handleTemplateChange}
          options={templateOptions}
          Icon={MUIIcon.Message}
          required
          disabled={templatesLoading}
        />

        {selectedTemplate && (
          <MUI.Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <MUI.Typography variant="subtitle2" gutterBottom>
              Preview do template:
            </MUI.Typography>
            <MUI.Typography variant="body2" color="text.secondary">
              {selectedTemplate.types['twilio/text']?.body || 'Template sem preview disponível'}
            </MUI.Typography>
          </MUI.Box>
        )}

        {selectedTemplate?.variables && Object.keys(selectedTemplate.variables).length > 0 && (
          <MUI.Box>
            <MUI.Typography variant="subtitle2" gutterBottom>
              Variáveis do template:
            </MUI.Typography>
            <MUI.Stack spacing={1}>
              {Object.keys(selectedTemplate.variables).map(key => (
                <CustomInput
                  key={key}
                  label={key}
                  placeholder={`Digite o valor para ${key}`}
                  value={variables[key] || ''}
                  onChange={(e) => handleVariableChange(key, e.target.value)}
                  type="text"
                  required
                />
              ))}
            </MUI.Stack>
          </MUI.Box>
        )}

        <CustomSelect
          label="Número de saída"
          placeholder="Selecione um número de saída"
          value={selectedSender}
          setValue={setSelectedSender}
          options={senderOptions}
          Icon={MUIIcon.Phone}
          required
        />

        <MUI.Stack direction="row" spacing={1}>
          <CustomButton
            value="Enviar"
            Icon={MUIIcon.Send}
            onClick={handleSend}
            loading={loading}
            disabled={!phoneNumber || !selectedTemplate || !selectedSender}
            color="success"
            width="auto"
          />
          <CustomButton
            value="Cancelar"
            Icon={MUIIcon.Close}
            onClick={onToggle}
            color="error"
            width="auto"
          />
        </MUI.Stack>
      </MUI.Stack>
    </MUI.Box>
  );
}; 