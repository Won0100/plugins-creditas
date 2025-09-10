import Charts from 'react-apexcharts';

type Props = {
    series: Array<number>;
    labels: Array<string>;
}

export const PieChart = ({ series, labels }: Props) => {    
    return (
        <div>            
            <Charts options={{
                chart: {
                    width: 380,
                    type: 'pie',
                },
                labels: labels,
                responsive: [{
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200
                        },
                        legend: {
                            position: 'bottom'
                        }
                    }
                }]
                }} 
                series={series} 
                type="pie" 
                width={380} 
            />                   
        </div>
    );    
}