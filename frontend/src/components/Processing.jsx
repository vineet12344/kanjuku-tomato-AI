const Processing = ({ file }) => {
    return (
        <div className="processing-view">
            <img src={file.preview} alt="Preview" className="preview-image" />
            <h2>Detecting Ripeness...</h2>
            <p>This may take a moment.</p>
        </div>
    );
};

export default Processing