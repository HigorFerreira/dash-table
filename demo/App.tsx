/* eslint no-magic-numbers: 0 */
import '@babel/polyfill/noConflict';
import * as R from 'ramda';
import React, { Component } from 'react';
import { DataTable } from 'dash-table/index';
import Environment from 'core/environment';
import { memoizeOne } from 'core/memoizer';
import Logger from 'core/Logger';
import AppState, { AppMode, AppFlavor } from './AppMode';

import './style.less';

class App extends Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            ...AppState,
            temp_filtering: ''
        };
    }

    renderMode() {
        const mode = Environment.searchParams.get('mode');
        const flavorParam = Environment.searchParams.get('flavor');
        const flavors = flavorParam ? flavorParam.split(';') : [];

        if (flavors.indexOf(AppFlavor.FilterNative) !== -1) {
            return (<div>
                <button
                    className='clear-filters'
                    onClick={() => {
                        const tableProps = R.clone(this.state.tableProps);
                        tableProps.filter_query = '';

                        this.setState({ tableProps });
                    }}
                >Clear Filter</button>
                <input
                    style={{ width: '500px' }}
                    value={this.state.temp_filtering}
                    onChange={
                        e => this.setState({ temp_filtering: e.target.value })
                    }
                    onBlur={e => {
                        const tableProps = R.clone(this.state.tableProps);
                        tableProps.filter_query = e.target.value;

                        this.setState({ tableProps });
                    }} />
            </div>);
        } else if (mode === AppMode.TaleOfTwoTables) {
            if (!this.state.tableProps2) {
                this.setState({
                    tableProps2: R.clone(this.state.tableProps)
                });
            }

            const baseId = this.state.tableProps2 && this.state.tableProps2.id;

            return (this.state.tableProps2 ? <DataTable
                {...this.state.tableProps2}
                id={baseId ? 'table2' : baseId}
            /> : null);
        }
    }

    render() {
        const data = [{'produto': '1559-LOC?O HIDRATANTE LA VIDA', 'vlvenda': 158432.45, 'qtvenda': 10707.0, 'vllucro': 82052.68}, {'produto': '1788-LOC?O HIDRATANTE LA LUNA', 'vlvenda': 128389.8, 'qtvenda': 9300.0, 'vllucro': 65448.91}, {'produto': '2226-DEO COLONIA KISS 100ML LATA', 'vlvenda': 97283.56, 'qtvenda': 3595.0, 'vllucro': 20736.74}, {'produto': '2127-LOC?O HIDRATANTE KISS', 'vlvenda': 78700.25, 'qtvenda': 5504.0, 'vllucro': 43699.92}, {'produto': '2539-DEO COLONIA NAH HELLO HELLO LATA', 'vlvenda': 53128.46, 'qtvenda': 1626.0, 'vllucro': 20949.33}, {'produto': '2201-DEO COLONIA BEE 100ML', 'vlvenda': 48054.54, 'qtvenda': 2051.0, 'vllucro': 18640.04}, {'produto': '2224-DEO COLONIA PINGUCHO 100ML', 'vlvenda': 32752.05, 'qtvenda': 1421.0, 'vllucro': 14712.61}, {'produto': '1110-LOC?O HIDRATANTE DREAM 240 ML ', 'vlvenda': 30508.45, 'qtvenda': 2096.0, 'vllucro': 17166.85}, {'produto': '2310-DEO COLONIA CICI MEL', 'vlvenda': 28159.29, 'qtvenda': 1195.0, 'vllucro': 10395.01}, {'produto': '2222-DEO COLONIA  RINO 100ML', 'vlvenda': 27651.82, 'qtvenda': 1194.0, 'vllucro': 12587.1},{'produto': '1559-LOC?O HIDRATANTE LA VIDA', 'vlvenda': 158432.45, 'qtvenda': 10707.0, 'vllucro': 82052.68}, {'produto': '1788-LOC?O HIDRATANTE LA LUNA', 'vlvenda': 128389.8, 'qtvenda': 9300.0, 'vllucro': 65448.91}, {'produto': '2226-DEO COLONIA KISS 100ML LATA', 'vlvenda': 97283.56, 'qtvenda': 3595.0, 'vllucro': 20736.74}, {'produto': '2127-LOC?O HIDRATANTE KISS', 'vlvenda': 78700.25, 'qtvenda': 5504.0, 'vllucro': 43699.92}, {'produto': '2539-DEO COLONIA NAH HELLO HELLO LATA', 'vlvenda': 53128.46, 'qtvenda': 1626.0, 'vllucro': 20949.33}, {'produto': '2201-DEO COLONIA BEE 100ML', 'vlvenda': 48054.54, 'qtvenda': 2051.0, 'vllucro': 18640.04}, {'produto': '2224-DEO COLONIA PINGUCHO 100ML', 'vlvenda': 32752.05, 'qtvenda': 1421.0, 'vllucro': 14712.61}, {'produto': '1110-LOC?O HIDRATANTE DREAM 240 ML ', 'vlvenda': 30508.45, 'qtvenda': 2096.0, 'vllucro': 17166.85}, {'produto': '2310-DEO COLONIA CICI MEL', 'vlvenda': 28159.29, 'qtvenda': 1195.0, 'vllucro': 10395.01}, {'produto': '2222-DEO COLONIA  RINO 100ML', 'vlvenda': 27651.82, 'qtvenda': 1194.0, 'vllucro': 12587.1}]
        const columns = [ 'produto', 'vlvenda', 'vllucro', 'qtvenda' ].map(el => {
            return {
                name: el,
                id: el,
                type: el === 'vlvenda' || el === 'vllucro' || el === 'qtvenda' ? 'numeric' : 'text',
                deletable: false,
                selectable: false,
                hideable: false,
            }
        })
        
        return (<div style={{ padding: "40px 0", height: '500px' }}>
            {this.renderMode()}
            <DataTable
                setProps={this.setProps()}
                {...this.state.tableProps}
                {...{
                    id: "table",
                    data,
                    columns,
                    filter_action: "custom",
                    sort_action: "custom",
                    sort_mode: "multi",
                    virtualization: false,
                }}
            />
        </div>);
    }

    private setProps = memoizeOne(() => {
        return (newProps: any) => {
            Logger.debug('--->', newProps);
            this.setState((prevState: any) => ({
                tableProps: R.merge(prevState.tableProps, newProps)
            }));
        };
    });
}

export default App;
