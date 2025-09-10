import { Workspaces } from '@mui/icons-material';
import { CustomSelect } from '../Custom/CustomSelect';
import { Dispatch, useEffect, useState } from 'react';
import { user } from '../../helpers/crmAthan/user';
import { tenantCrm } from '../../services/crmAthan/tenant';
import { TenantType } from '../../types/crmAthan/tenants';

type Props = {
    value: string;
    setValue: Dispatch<string>;
}

export const SelectTenant = ({ value, setValue }: Props) => {
    const [userType] = useState(user.type());
    const [tenantsList, setTenantList] = useState<TenantType[]>([]);
    
    useEffect(() => {
        if(userType === 'master') {
            (async () => {
                const response = await tenantCrm.list();
                setTenantList(response || []);
            })();
        }
    }, [userType])

    if(userType !== 'master') return <></>;

    return (
        <CustomSelect
            label="Tenant"
            placeholder="Tenant"
            height="36px"
            Icon={Workspaces}
            value={value}
            setValue={setValue}
            options={tenantsList.map(tenant => {
                return {
                    label: tenant.tenant_name,
                    value: tenant.tenant_id.toString()
                }
            })}
        />
    )
}