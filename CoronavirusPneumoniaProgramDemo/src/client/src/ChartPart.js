import React from 'react';
import { Bar } from 'react-chartjs-2';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { DataLabels } from 'chartjs-plugin-datalabels';
import NoticeAlert from './NoticeAlert';
import { Image } from 'react-bootstrap';
import azureImage from './image/一站式防疫信息实时互动平台主KV.jpg';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

class ChartPart extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {chartData: {}};
        this.updateChart = this.updateChart.bind(this);
    }

    componentDidMount() {
        const connection = new HubConnectionBuilder()
            .withUrl(`${apiBaseUrl}/api`)
            .build();

        connection.on('updateChart', this.updateChart);
        connection.start()
            .then(() => {
                console.log("connected");
                fetch(`${apiBaseUrl}/api/chart`);
            })
            .catch(error => {
                console.error(error.message)
            });
    }

    updateChart(message) {
        this.setState({
            chartData: {
                datasets: [{
                    label: '观众',
                    data: [message.audienceCount],
                    backgroundColor: "#2eb7e6"
                },
                {
                    label: '弹幕',
                    data: [message.commentCount],
                    backgroundColor: "#f08029"
                },
                {
                    label: '通知',
                    data: [message.noticeCount],
                    backgroundColor: "#68b141"
                }]
            }
        });
    }

    render() {
        const options = {
            legend: {
                position: "bottom"
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }}]
            },
            plugins: {
                datalabels: {
                    display: function(context) {
                        return context
                    },
                    font: {
                        weight: 'bold'
                    }
                }
            },
            tooltips: {
                enabled: false
            }
        };

        return (
            <div>
                <Image src={azureImage} style={{width: "98%"}} />
                <h3 className="text-left my-3">实时统计</h3>
                <Bar data={this.state.chartData} options={options} plugins={DataLabels}/>
                <NoticeAlert />
            </div>
        )
    }
}

export default ChartPart;
