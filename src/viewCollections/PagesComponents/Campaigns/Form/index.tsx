import { PageLayout } from '../../../../components/PageLayout';
import { CustomBreadcrumb } from '../../../../components/Custom/CustomBreadcrumb';
import { CustomButton } from '../../../../components/Custom/CustomButton';
import { location } from '../../../../helpers/location';
import { user } from '../../../../helpers/crmAthan/user';
import { ArrowBack } from '@mui/icons-material';
import { invokeAction } from '../../../../actions/invoke';
import * as MUI from '@mui/material';
import { useEffect, useState } from 'react';
import { Steps } from './Steps';
import { Campaign } from './Campaign';
import { PayloadCampaignType } from '../../../../types/dialer/campaigns';
import { cobrecomAI } from '../../../../services/dialer/cobrecomAI';
import { CobrecomRobotType } from '../../../../types/dialer/cobrecomAI';
import { TemplateType } from '../../../../types/dialer/templates';
import { templates } from '../../../../services/dialer/templates';
import { useSnackbar } from '../../../../hooks/useSnackbar';
import { campaigns } from '../../../../services/dialer/campaigns';
import { campaign } from '../../../../helpers/dialer/campaign';
import { Recurrence } from './Recurrence';
import { RecurrenceType } from 'types/dialer/recurrence';

export const Form = () => {
    const { throwAlert } = useSnackbar();
    
    const [activeStep, setActiveStep] = useState(0);
    const [userSelected] = useState(user.selected());  
    
    const campaignId = location.getParam('id') as string;

    //requests
    const [robot, setRobot] = useState<CobrecomRobotType[]>([]);
    const [templatesList, setTemplatesList] = useState<TemplateType[]>([]);

    //campaign
    const [payloadCampaign, setPayloadCampaign] = useState<PayloadCampaignType>({
        campaign: { status: 'active' },
        config: { host: 1 }
    });    

    //recurrence
    const [payloadRecurrence, setPayloadRecurrence] = useState<RecurrenceType>();
    const [dataRecurrence, setDataRecurrence] = useState<RecurrenceType[]>([])

    useEffect(() => {
        if(campaignId) {
            (async () => {
                const getCampaign = await campaigns.getItem(campaignId);
                
                if(getCampaign?.success) {
                    const formatCampaign = campaign.formatDataInPayloadCampaign(
                        getCampaign.data
                    );                                        
                    setPayloadCampaign(formatCampaign);
                    setDataRecurrence(getCampaign.data.Config.Recurrences);
                }
            })();
        }
    }, [campaignId])

    useEffect(() => {
        if(payloadCampaign?.config?.attendanceType === 'cobrecomAI') {
            (async () => {
                const reqRobot = await cobrecomAI.getPage(userSelected.tenant_id.toString());
                setRobot(reqRobot?.data?.rows || []);
            })();
        }
    }, [userSelected, payloadCampaign?.config?.attendanceType]);

    useEffect(() => {
        (async () => {
            const reqTemplates = await templates.list();
            setTemplatesList(reqTemplates || []);
        })();
    }, [])

    const handleStep = (step: number) => {
        setActiveStep(step);
    }

    const handleCampaign = async () => {
        const checkData = campaign.checkPayload(payloadCampaign, throwAlert);        
        
        if(checkData) {            
            if(campaignId) {
                const update = await campaigns.update(payloadCampaign);
            } else {
                const create = await campaigns.create(payloadCampaign);                

                if(create?.success) {
                    const formatCampaign = campaign.formatDataInPayloadCampaign(create.data);
                    setPayloadCampaign(formatCampaign);
                    handleStep(1); 
                    throwAlert('success', 'Campanha criada!');
                }
            }
        }
    }

    return (
        <PageLayout
            Breadcrumb={
                <CustomBreadcrumb 
                    title="Campanhas"
                    subtitle={
                        campaignId
                        ? 'Editar campanha'
                        : 'Criar campanha'
                    }
                    path="dialer-campaigns"
                />
            }
            ButtonsActions={
                <CustomButton
                    value="Voltar"
                    onClick={() => invokeAction.navigateToView('dialer-campaigns')}
                    Icon={ArrowBack}
                />
            }
        >
            <MUI.Stack direction="row">
                <Steps
                    setActiveStep={setActiveStep}
                    activeStep={activeStep}
                />
                <MUI.Box width="100%">                    
                    {activeStep === 0 &&
                        <Campaign 
                            payloadCampaign={payloadCampaign} 
                            setPayloadCampaign={setPayloadCampaign} 
                            robot={robot}
                            templatesList={templatesList}
                            handleCampaign={handleCampaign}
                            campaignId={campaignId}
                            handleStep={handleStep}
                        />                    
                    }
                    {activeStep === 1 &&
                        <Recurrence
                            payloadRecurrence={payloadRecurrence}
                            setPayloadRecurrence={setPayloadRecurrence}
                            typeCampaign={payloadCampaign?.config?.type as string}
                            dataRecurrence={dataRecurrence}
                        />
                    }
                </MUI.Box>
            </MUI.Stack>
        </PageLayout>
    )
}