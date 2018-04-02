/* eslint jsx-a11y/media-has-caption: 0, no-param-reassign: 0 */
import React from 'react';
import PropTypes from 'prop-types';

export default class VideoDisplay extends React.Component {
  componentDidMount() {
    // Create an internal "snapshot" canvas
    this.canvasRef = document.createElement('canvas');
    // Now actually load the video
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((videoStream) => {
        const video = document.querySelector('video');
        video.srcObject = videoStream;
        video.play();
        // Do onLoad callback
        this.props.onLoad();
      }).catch((err) => {
        this.props.onError(err);
      });
  }

  componentWillUnmount() {
    // Remove our internal "snapshot" canvas
    this.canvasRef.remove();
    this.canvasRef = null;
  }

  /**
   * @returns the current video frame as URL-encoded JPEG data
   */
  captureAsJpeg() {
    return this.captureToCanvas(this.canvasRef).toDataURL('image/jpeg');
  }

  captureAsPng() {
    return this.captureToCanvas(this.canvasRef).toDataURL('image/png');
  }

  /**
   * Save the current video frame to the provided canvas.
   * @param {HTMLCanvasElement} canvas The canvas to which the current video frame will be saved.
   * @returns The canvas parameter
   */
  captureToCanvas(canvas) {
    const { videoRef } = this;
    canvas.width = videoRef.videoWidth;
    canvas.height = videoRef.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef, 0, 0, videoRef.videoWidth, videoRef.videoHeight);
    return canvas;
  }

  render() {
    return (
      <div>
        <video
          ref={(input) => { this.videoRef = input; }}
          autoPlay>
          Webcam failed to load.
        </video>
      </div>
    );
  }
}
VideoDisplay.propTypes = {
  onLoad: PropTypes.func,
  onError: PropTypes.func.isRequired,
};
VideoDisplay.defaultProps = {
  onLoad: () => {},
};
