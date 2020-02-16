import React from 'react';
import Alert from 'react-bootstrap/Alert';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { Button } from 'react-bootstrap';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
const speechKey = process.env.REACT_APP_SPEECH_KEY;
const speechRegion = process.env.REACT_APP_SPEECH_REGION;

class NoticeAlert extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {noticeText: "", sound: null};

        this.newNotice = this.newNotice.bind(this);
        this.playAudio = this.playAudio.bind(this);
    }

    componentDidMount() {
        const connection = new HubConnectionBuilder()
            .withUrl(`${apiBaseUrl}/api`)
            .build();

        connection.on('newNotice', this.newNotice);
        connection.start()
            .then(() => {
                console.log("connected");
                setTimeout(() => {
                    fetch(`${apiBaseUrl}/api/getNotice`);
                }, 1000);
            })
            .catch(error => {
                console.error(error.message)
            });
    }

    newNotice(message) {
        this.setState({
            noticeText: message
        });
        this.checkNoticeLength();

        fetch(`https://${speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issuetoken`, {
            method: 'POST', // or 'PUT'
            headers: {
                'Ocp-Apim-Subscription-Key': speechKey
            }
        })
        .then(result => {
            result.text().then(token => {
                const requestBody = `<speak version='1.0' xmlns='https://www.w3.org/2001/10/synthesis' xml:lang='en-US'><voice name='Microsoft Server Speech Text to Speech Voice (zh-CN, XiaoxiaoNeural)'>${message}</voice></speak>`;
    
                fetch(`https://${speechRegion}.tts.speech.microsoft.com/cognitiveservices/v1`, {
                    method: 'POST', // or 'PUT'
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
                        'Content-Type': 'application/ssml+xml; charset=utf-8'
                    },
                    body: requestBody
                })
                .then(response => response.blob())
                .then(blob => {
                    const audioFile = new Audio(URL.createObjectURL(blob));
                    this.setState({
                        sound: audioFile
                    });
                    audioFile.play();
                });
            })
        });

    }

    checkNoticeLength() {
        let noticeText = document.querySelector("#alert");
        if (noticeText) {
            noticeText.classList.remove("marquee")
            if (noticeText.offsetWidth > window.innerWidth) {
                noticeText.classList.add("marquee");
            }
        }
    }

    playAudio() {
        this.state.sound.play();
    }

    render() {
        return (
            <div>
                {this.state.noticeText.length > 0 &&
                    <Alert style={{backgroundColor: '#132135', borderColor: '#113964'}} variant="primary" className="fixed-top text-nowrap ">
                        <div className="text-white" id="alert" style={{width: "max-content font-weight-bold"}}>
                            {this.state.noticeText}
                        </div>
                        {this.state.sound != null &&
                            <Button onClick={this.playAudio} variant="primary" className="mx-2 position-absolute d-inline" style={{top: '5px', right: '10px'}}>
                                语音播放
                            </Button>
                        }
                    </Alert>
                }
            </div>
        );
    }
}

export default NoticeAlert;
