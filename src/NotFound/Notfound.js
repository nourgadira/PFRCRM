import React from 'react';

const NotFoundPage = () => {
    return (
        <div style={styles.container}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#f44336"
                viewBox="0 0 24 24"
                style={styles.svg}
            >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-5c-.83 0-1.5-.67-1.5-1.5S11.17 12 12 12s1.5.67 1.5 1.5S12.83 15 12 15z" />
            </svg>
            <div>
                <h1 style={styles.heading}>404 - Page Non Trouvée</h1>
                <p style={styles.paragraph}>La page que vous recherchez n'existe pas.</p>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
    },
    svg: {
        width: '80px',
        height: '80px',
        marginBottom: '20px',
    },
    heading: {
        fontSize: '2rem',
        color: '#f44336',
    },
    paragraph: {
        fontSize: '1.2rem',
        color: '#757575',
    },
};

export default NotFoundPage;
