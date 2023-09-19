function Welcome() {
    return (
        <div>
            <a href="/Home" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ marginTop: '230px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <h1>Welcome!</h1>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <div style={{ width: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                        <h5>Let's start your journey into the tech world here!</h5>
                    </div>
                </div>
            </a>
            
        </div>

    );
}

export default Welcome;