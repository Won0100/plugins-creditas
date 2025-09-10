import * as MUI from '@mui/material';
import { CampaignStatisticsType } from '../../../../types/dialer/campaigns';
import { PieChart } from '../../../../components/Charts/PieChart';
import { BarChart } from '../../../../components/Charts/BarChart';
import * as S from './styled';

type Props = {
    campaign: CampaignStatisticsType;
}

export const Campaign = ({ campaign }: Props) => {
    return (
        <MUI.Box margin="10px">
            <MUI.Stack direction="row" width="100%" textAlign="center" spacing={2} marginBottom="20px">            
                <MUI.Box flexGrow={1}>
                    <S.PaperContainer elevation={5}>
                        <MUI.Typography>{campaign.accessed.message}</MUI.Typography>
                        <PieChart
                            series={[
                                campaign.accessed.total_accessed,
                                campaign.accessed.total_contacts
                            ]}
                            labels={[
                                "Total acessados",
                                "Total de contatos"
                            ]}
                        />
                    </S.PaperContainer>
                </MUI.Box>
                <MUI.Box flexGrow={1}>
                    <S.PaperContainer elevation={5}>
                        <MUI.Typography>{campaign.completed.message}</MUI.Typography>
                        <PieChart
                            series={[
                                campaign.completed.total_completed,
                                campaign.completed.total_contacts
                            ]}
                            labels={[
                                "Total completados",
                                "Total de contatos"
                            ]}
                        />  
                    </S.PaperContainer>
                </MUI.Box>            
            </MUI.Stack>            
            <MUI.Box>
                <S.PaperContainer elevation={5}>
                    <MUI.Typography>Status</MUI.Typography>
                    <MUI.Box maxWidth="600px" width="100%">
                        <BarChart jobs={campaign.jobs.status || campaign.jobs} />
                    </MUI.Box>
                </S.PaperContainer>
            </MUI.Box>  
        </MUI.Box>
    )
}