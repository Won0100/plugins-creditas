import { localStorage } from '../localStorage/actions';
import { UserType } from '../../types/crmAthan/auth';
import { TenantType } from '../../types/crmAthan/tenants';
import { LocalStorageItemType } from '../localStorage/LocalStorageItemType';

export const user = {
    profiles: () => {
        const dataString = localStorage.get(LocalStorageItemType.ATHAN_AUTH_CRM_DATA);
        const authStorage: UserType[] = dataString ? JSON.parse(dataString) : '';        
        return authStorage;
    },
    selected: () => {
        const dataString = localStorage.get(LocalStorageItemType.ATHAN_USER_CRM_DATA);
        const userSelected: UserType = dataString ? JSON.parse(dataString) : '';        
        return userSelected;
    },
    type: () => {
        return user.selected()?.type;        
    },
    tenantData: () => {
        const dataString = localStorage.get(LocalStorageItemType.ATHAN_TENANT_CRM_DATA);
        const tenantUser: TenantType = dataString ? JSON.parse(dataString) : '';
        return tenantUser;
    }
}