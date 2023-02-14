import React from 'react';


const LayoutAdmin = ({ children }) => {

    return (
        <div className="layoutAdmin" style={styles.LayoutAdmin}>
            { children}
        </div>
    )
}

const styles = {
    LayoutAdmin: {
        zIndex: '0',
        marginTop: '100px',
        marginLeft: '225px',
        marginRight: '20px',
        marginBottom: '20px'
    }
}

export default LayoutAdmin;