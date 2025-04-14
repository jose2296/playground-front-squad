const GolfV2 = () => {
    document.documentElement.requestFullscreen();

    return <div style={{
        width: '100%',
        height: '100vh'
    }}>
        <iframe src="/golf-v2/index.html" width={'100%'} height={'100%'} />
    </div>
}

export default GolfV2;