export const location = {
    getParam: (key: string) => {
        //if('URLSearchParams' in window) {
            const searchParams = new URLSearchParams(window.location.search);       
            const param = searchParams.get(key);

            return param ? param.replace('/', '') : '';
        //}
    }
}