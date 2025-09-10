import * as MUIIcon from '@mui/icons-material';
import { CustomFilter } from '../../../../components/Custom/CustomFilter';
import { CustomInput } from '../../../../components/Custom/CustomInput';
import { CustomSelect } from '../../../../components/Custom/CustomSelect';
import { channels } from '../../../../helpers/channels';
import { SelectTenant } from '../../../../components/SelectTenant';
import { Dispatch, MouseEventHandler } from 'react';

type Props = {
    dateStart: string;
    setDateStart: Dispatch<string>;
    dateEnd: string;
    setDateEnd: Dispatch<string>;
    campaignId: string;
    campaignIdFilter: string;
    setCampaignIdFilter: Dispatch<string>;
    mailingIdFilter: string;
    setMailingIdFilter: Dispatch<string>;
    channel: string;
    setChannel: Dispatch<string>;
    tenantId: string;
    setTenantId: Dispatch<string>;
    onFilter: MouseEventHandler<HTMLButtonElement>;
}

export const OnFilter = ({
    dateStart,
    setDateStart,
    dateEnd,
    setDateEnd,
    campaignId,
    campaignIdFilter,
    setCampaignIdFilter,
    mailingIdFilter,
    setMailingIdFilter,
    channel,
    setChannel,
    tenantId,
    setTenantId,
    onFilter
}: Props) => {
    return (
        <CustomFilter onFilter={onFilter}>
            <CustomInput
                label="Data início"
                placeholder="Data início"
                type="date"
                value={dateStart}
                Icon={MUIIcon.CalendarToday}
                height="36px"
                onChange={(e) => setDateStart(e.target.value)}
            />
            <CustomInput
                label="Data fim"
                placeholder="Data fim"
                type="date"
                value={dateEnd}
                Icon={MUIIcon.CalendarToday}
                height="36px"
                onChange={(e) => setDateEnd(e.target.value)}
            />
            {!campaignId &&
                <CustomInput
                    label="Campanha ID"
                    placeholder="Campanha ID"
                    type="text"
                    value={campaignIdFilter}
                    Icon={MUIIcon.Campaign}
                    height="36px"
                    onChange={(e) => setCampaignIdFilter(e.target.value)}
                />
            }
            <CustomInput
                label="Mailing ID"
                placeholder="Mailing ID"
                type="text"
                value={mailingIdFilter}
                Icon={MUIIcon.List}
                height="36px"
                onChange={(e) => setMailingIdFilter(e.target.value)}
            />
            <CustomSelect
                label="Tipo"
                placeholder="Tipo"
                height="36px"
                Icon={MUIIcon.ChatBubble}
                value={channel}
                options={channels.getTypes()}
                setValue={setChannel}
            />
            <SelectTenant value={tenantId} setValue={setTenantId} />
        </CustomFilter>
    )
}