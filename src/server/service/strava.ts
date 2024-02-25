import { Service } from 'typedi';


@Service()
class SpreadsheetService {
    
    getSpreadsheets = () => {
        
        return [
            {id: "123abc", spreadsheetName: "Spreadsheet1"},
            {id: "312", spreadsheetName: "Spreadsheet2"},
        ]
    }
    
}

export default SpreadsheetService;