import * as MUI from '@mui/material';
import * as S from './styled';
import { MailingStatisticsType } from '../../../../types/dialer/campaigns';
import { PieChart } from '../../../../components/Charts/PieChart';
import { BarChart } from '../../../../components/Charts/BarChart';
import { SimpleTitle } from '../../../commonStyled';

type Props = {
    mailings: MailingStatisticsType[];
}

export const Mailing = ({ mailings }: Props) => {
    return (
        <MUI.Box margin="10px">
            {mailings.map(mailing => (
                <S.PaperContainer elevation={5} key={mailing.mailing_id} sx={{ marginBottom: '20px' }}>
                    <SimpleTitle>{mailing.name}</SimpleTitle>
                    <MUI.Stack direction="row" width="100%" textAlign="center" spacing={2} marginBottom="20px">            
                        <MUI.Box flexGrow={1}>
                            <MUI.Typography>{mailing.statistic.mailing_accessed.message}</MUI.Typography>
                            <PieChart
                                series={[
                                    mailing.statistic.mailing_accessed.total.contacts_accessed,
                                    mailing.statistic.mailing_accessed.total.total_contacts
                                ]}
                                labels={[
                                    "Total acessados",
                                    "Total de contatos"
                                ]}
                            />
                        </MUI.Box>
                        <MUI.Box flexGrow={1}>
                            <MUI.Typography>{mailing.statistic.mailing.message}</MUI.Typography>
                            <PieChart
                                series={[
                                    mailing.statistic.mailing.total.contacts_completed,
                                    mailing.statistic.mailing.total.total_contacts
                                ]}
                                labels={[
                                    "Total completados",
                                    "Total de contatos"
                                ]}
                            /> 
                        </MUI.Box>            
                    </MUI.Stack>            
                    <MUI.Stack direction="column" alignItems="center" width="100%">
                        <MUI.Typography>Status</MUI.Typography>
                        <MUI.Box maxWidth="600px" width="100%">
                            <BarChart jobs={mailing.statistic.jobs.total.status} />
                        </MUI.Box>
                    </MUI.Stack>  
                </S.PaperContainer>
            ))}
        </MUI.Box>
    )
}