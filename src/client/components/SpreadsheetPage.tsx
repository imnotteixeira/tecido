import React, { useEffect, useState } from 'react';
import { SpreadsheetPageContext } from '../../shared';

const SpreadsheetPage: React.FC<SpreadsheetPageContext> = (props) => {
    
    const [disabled, setDisabled] = useState<boolean>(()=>true)
    

    useEffect(() => {
        // This is important, as it makes the app "usable" once it is hydrated
        setDisabled(false)
    }, [])


    return (
        <div>
            <h1>Spreadsheet</h1>
            <h2>{props.spreadsheetName}</h2>
        </div>
    );
}

export default SpreadsheetPage;
