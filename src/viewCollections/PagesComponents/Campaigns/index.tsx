import { PageLayout } from '../../../components/PageLayout';
import * as MUI from '@mui/material';
import * as MUIIcon from '@mui/icons-material';
import { CustomPagination } from '../../../components/Custom/CustomPagination';
import * as S from './styled';
import { Fragment, useEffect, useState } from 'react';
import { campaigns } from '../../../services/dialer/campaigns';
import { CampaignPageItemType } from '../../../types/dialer/campaigns';
import { PaginationType } from '../../../types/pagination';
import { date } from '../../../helpers/date';
import { invokeAction } from '../../../actions/invoke';
import { Backdrop } from '../../../components/Backdrop';
import { NoData } from '../../commonStyled';
import { strings } from '../../../helpers/strings';
import { CustomButton } from '../../../components/Custom/CustomButton';

export const Campaigns = () => {
    const [campaignsData, setCampaignsData] = useState<CampaignPageItemType[]>([]);;
    const [pagination, setPagination] = useState<PaginationType>();
    const [page, setPage] = useState('0');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            setLoading(true);

            const response = await campaigns.getPage(page, '10');
            if(response?.success) {
                setCampaignsData(response.data.rows);
                setPagination(response.data.pagination);
            }

            setLoading(false);
        })()
    }, [page])

    return (
        <PageLayout 
            title="Campanhas"
            ButtonsActions={
                <>                    
                    <CustomButton
                        value="Estatísticas"
                        Icon={MUIIcon.QueryStats}
                        onClick={() => invokeAction.navigateToView('dialer-campaigns-statistic')}                                                
                    />
                    <CustomButton
                        value="Criar"
                        Icon={MUIIcon.Campaign}
                        onClick={() => invokeAction.navigateToView('dialer-campaigns-form')}                                                
                    />
                </>
            }
        >
            <S.ContainerCard>
                {campaignsData.map((campaign) => (
                    <S.CampaignCard key={campaign.id} elevation={5}>
                        <S.Title 
                            title={campaign.name} 
                            gutterBottom 
                            variant="h5"
                        >
                            {strings.stringLimiter(campaign.name, 15)}
                        </S.Title>
                        <S.ContainerText>
                            <MUIIcon.Timer />
                            {date.getOnlytime(campaign.createdAt)}
                        </S.ContainerText>
                        <S.ContainerText>
                            <MUIIcon.CalendarMonth />
                            {date.getOnlyDate(campaign.createdAt)}
                        </S.ContainerText>
                        <S.ContainerText>
                            <MUIIcon.Campaign />
                            {campaign.type}
                        </S.ContainerText>
                        <MUI.Box display="flex" justifyContent="space-between">
                            <MUI.Chip 
                                label={
                                    date.dateGreaterThanNow(campaign.last_triggered_date)
                                    ? 'Ativa'
                                    : 'Expirada'
                                } 
                                size="medium" 
                                variant="outlined" 
                                color="primary" 
                                sx={{ p: '15px' }} 
                            />
                            <S.BoxSpeedDial>
                                <S.BoxSpeedDialItem
                                    ariaLabel="SpeedDial controlled open example"                                    
                                    icon={<MUI.SpeedDialIcon />}
                                >                                        
                                    <MUI.SpeedDialAction 
                                        icon={<MUIIcon.Edit />} 
                                        tooltipTitle="Editar" 
                                        onClick={() => invokeAction.navigateToView(`dialer-campaigns-form?id=${campaign.id}`)}
                                    />
                                    {/* <MUI.SpeedDialAction icon={<MUIIcon.Dvr />} tooltipTitle="Resumo" /> */}                                        
                                    <MUI.SpeedDialAction 
                                        icon={<MUIIcon.QueryStats />} 
                                        tooltipTitle="Estatísticas" 
                                        onClick={() => invokeAction.navigateToView(`dialer-campaigns-statistic?id=${campaign.id}`)}
                                    />                                        
                                </S.BoxSpeedDialItem>
                            </S.BoxSpeedDial>
                        </MUI.Box>
                    </S.CampaignCard>
                ))}
                {(!loading && campaignsData.length === 0) &&
                    <NoData>Campanhas não encontradas!</NoData>
                }
            </S.ContainerCard>            
            <CustomPagination page={page} setPage={setPage} pages={pagination?.pages || 0} />            
            <Backdrop loading={loading} />
        </PageLayout>
    );
}