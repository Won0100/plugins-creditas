export const date = {
    getOnlytime: (hoursString: string) => {
        const date = new Date(hoursString);

        return date.toLocaleTimeString('pt-BR', {
            hour12: false,
            timeStyle: 'medium'
        });
    },
    getOnlyDate: (dateString: string) => {
        const date = new Date(dateString);

        return date.toLocaleDateString('pt-BR', {
            hour12: false,
            dateStyle: 'short'
        });
    },   
    getFormattedLocalDate: (fullDateString: string) => {
        const date = new Date(fullDateString);
        const dateLocal = date.toLocaleDateString('pt-BR', {
            hour12: false,
            dateStyle: 'short'
        });
        const timeLocal = date.toLocaleTimeString('pt-BR', {
            hour12: false,
            timeStyle: 'medium'
        });

        return `${dateLocal} ${timeLocal}`;
    },   
    dateGreaterThanNow: (date: string) => {
        const now = new Date().toISOString();

        return Date.parse(date.split('T')[0]) >= Date.parse(now.split('T')[0]);
    },
    splitTDateISOString: (date: string) => {
        return date.split('T')[0];
    },
    stringForMiliseconds: (timeString: string) => {
        if(timeString.length === 5) timeString = `${timeString}:00`;        

        const parts = timeString.split(':');
        const hours = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10);
        const seconds = parseInt(parts[2], 10);
    
        return hours * 3600 * 1000 + minutes * 60 * 1000 + seconds * 1000;
    },
    millisecondsToString:(milliseconds: number) => {        
        let seconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(seconds / 3600);
        seconds %= 3600;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
            
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;        
    },
    getTimestampInSeconds: (dateString: string | Date) => {
        return new Date(dateString).getTime() / 1000;
    }
}