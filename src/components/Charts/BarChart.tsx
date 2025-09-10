import Charts from 'react-apexcharts';
import { JobsType } from '../../types/dialer/campaigns';

type Props = {
  jobs: JobsType;
}

export const BarChart = ({ jobs }: Props) => {    
    return (
        <div>            
            {[0].map(() => {              
              const jobsData = jobs.reduce(
                (acc, curr) => {
                  const status = Object.keys(curr)[0]
                  acc[status] = {
                    count: curr[status].count,
                    percentage: curr[status].percentage
                  }
                  return acc
                },
                {}
              )

              const jobsSeries = Object.keys(jobsData).map(
                (status) => jobsData[status].count
              )
              const jobsLabelsPercentage = Object.keys(jobsData).map(
                (status) => [[status], [`${jobsData[status].percentage}%`]]
              )

              return (
                <Charts
                  key="1"
                  series={[{ data: jobsSeries }]}
                  type="bar"
                  options={{
                    chart: {
                      height: 350,
                      width: '400px'
                    },
                    plotOptions: {
                      bar: {
                        columnWidth: '45%',
                        distributed: true
                      }
                    },
                    dataLabels: {
                      enabled: false
                    },
                    xaxis: {
                      categories: jobsLabelsPercentage,
                      labels: {
                        style: {
                          fontSize: '13px'
                        }
                      }
                    },
                    responsive: [
                      {
                        breakpoint: 600,
                        options: {
                          chart: {
                            height: 500
                          },
                          plotOptions: {
                            bar: {
                              horizontal: true
                            }
                          },
                          yaxis: {
                            labels: {
                              style: {
                                fontSize: '0'
                              }
                            }
                          }
                        }
                      }
                    ]
                  }}
                />
              )
            })}                   
        </div>
    );    
}