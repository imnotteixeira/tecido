import { NodeMesh, IBaseType } from '@tecido/math-cells-manager';
import React, { useEffect, useRef, useState } from 'react';

const DEFAULT_LINE_COUNT = 3;
const DEFAULT_COLUMN_COUNT = 3;

interface SpreadsheetProps {
    initialLineCount?: number;
    initialColumnCount?: number;
}

const Spreadsheet: React.FC<SpreadsheetProps> = ({
    initialLineCount = DEFAULT_LINE_COUNT,
    initialColumnCount = DEFAULT_COLUMN_COUNT,
    ...props
}: SpreadsheetProps) => {

    const [numLines, setNumLines] = useState(initialLineCount);
    const [numColumns, setNumColumns] = useState(initialColumnCount);

    const [nodeIds, setNodeIds] = useState<Record<string, string[]>>(generateNodeIds(initialLineCount, initialColumnCount))
    
    const nodeMesh = useRef<NodeMesh<IBaseType<any>>>();
    useEffect(() => {
        nodeMesh.current = new NodeMesh([])
    })




    return (
        <div className="spreadsheet">
            <table>
                <tr>
                    <th>EMPTY</th>
                    {
                        Array(numColumns).fill(0).map((_,i) => numberToLetter(i)).map(colId => 
                            <th>{colId}</th>
                        )
                    }
                </tr>
                {
                    Object.entries(nodeIds).map(([row, cols]) => (
                        <tr>
                            <td>{row}</td>
                            {cols.map(col => <td>{col}{row}</td>)}
                        </tr>
                    ))
                }
                    
            </table>
        </div>
    )
}

const generateNodeIds = (nRows: number, nCols: number) => () => {
    const nodeIds: Record<number, string[]> = {}
    for (let row = 0; row < nRows; row++) {
        const cols = []
        for (let col = 0; col < nCols; col++) {
            const colName = numberToLetter(col)
            cols.push(colName)
        }
        nodeIds[row + 1] = cols
    }
    return nodeIds;
}

const numberToLetter = (num: number) => {
    let result = ""
    let remainder = num;
    do {
        const left = remainder / 26;
        const right = remainder % 26;

        const nextCharCode = 65 + right;
        remainder = Math.floor(left) - 1;
        result = String.fromCharCode(nextCharCode) + result;
    } while (remainder >= 0)
    
    return result;
}

export default Spreadsheet;