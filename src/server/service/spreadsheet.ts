import { injectable } from "inversify";


@injectable()
class SpreadsheetService {
    
    getSpreadsheets = () => {
        
        return [
            {id: "123abc", spreadsheetName: "Spreadsheet1"},
            {id: "312", spreadsheetName: "Spreadsheet2"},
        ]
    }
    
}

export default SpreadsheetService;