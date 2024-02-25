import React, { useEffect, useState } from 'react';
import { PageContext, SpreadsheetPageContext } from '../../shared';
import { PageType } from '../../shared/constants';
import SpreadsheetPage from './SpreadsheetPage';


const App: React.FC<PageContext> = (props) => {
    
    const [disabled, setDisabled] = useState<boolean>(()=>true)
    

    useEffect(() => {
        // This is important, as it makes the app "usable" once it is hydrated
        setDisabled(false)
    }, [])


    return (
        // TODO: Use the `disabled` flag (passing as context?)
        // TODO: Use frontend routing when applicable
        <div>
            <h1>This is a {props.pageType} page</h1>
            {props.pageType === PageType.SPREADSHEET && <SpreadsheetPage {...props as SpreadsheetPageContext}/>}
        </div>
    );
}

export default App;
