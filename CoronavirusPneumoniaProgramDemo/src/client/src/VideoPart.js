import React from 'react';
import { Button, Image } from 'react-bootstrap';
import { HubConnectionBuilder } from '@microsoft/signalr';
import staffImage from './image/职员nv.png';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
class VideoPart extends React.Component {

    constructor(props) {
        super(props);
    
        this.state = {
            videoSource: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
            comments: [],
            commentText: "",
            commentTexts: []
        };

        this.updateComments = this.updateComments.bind(this);
        this.changeComment = this.changeComment.bind(this);
        this.submitComment = this.submitComment.bind(this);
        this.newMessage = this.newMessage.bind(this);
    }

    componentDidMount() {
        const connection = new HubConnectionBuilder()
            .withUrl(`${apiBaseUrl}/api`)
            .build();

        connection.on('newMessage', this.newMessage);
        connection.start()
            .then(() => {
                console.log("connected");
            })
            .catch(error => {
                console.error(error.message)
            });
    }

    newMessage(message) {
        this.state.commentTexts.push(message.comment)
        this.setState({
            commentTexts: this.state.commentTexts,
            commentText: ""
        });

        this.updateComments(this.state.commentTexts);
    }

    updateComments(comments) {
        const commentObjects = comments.map((text, index) => {
            return {
                text: text,
                position: (index % 3) * 24
            }
        });

        this.setState({
            comments: commentObjects
        });
    }

    changeComment(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    submitComment(event) {
        event.preventDefault();

        const data = { comment: this.state.commentText };

        fetch(`${apiBaseUrl}/api/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    }

    render() {
        return (
            <div>
                <div className="position-relative overflow-hidden">
                    <video controls className="w-100" src={this.state.videoSource}></video>
                    {this.state.comments.map((comment, index) =>
                        <p key={index} className="h4 comment text-dark" style={{top: comment.position + "px"}}>{comment.text}</p>
                    )}
                </div>
                <form style={{backgroundColor: '#262930'}} className="form-inline py-1 px-3" onSubmit={this.submitComment}>
                    <div className="form-group m-0">
                        <input name="commentText" value={this.state.commentText} onChange={this.changeComment} type="text" className="form-control" placeholder="聊天..." id="comment" />
                    </div>
                    <Button variant="primary" type="submit" className="mx-2">发送</Button>
                    <Image src={staffImage} roundedCircle fluid className="border border-primary position-absolute" style={{ width: "5%", right: "40px" }} />
                </form>
            </div>
        )
    }
}

export default VideoPart;
