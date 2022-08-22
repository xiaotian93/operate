import React, { Component } from 'react';

import Detail_zzb from './../detail/detail_zzb';
import Detail_bmd from './../detail/detailBmd';
import Detail_gyl from './../detail/detail_gyl';
import Detail_ygd from './../detail/detail_ygd';
import Detail_jyd from './../detail/detail_jyd';
class Particulars extends Component {
    render() {
        let product_map = {
            "zzb":Detail_zzb,
            "cashloan":Detail_bmd,
            "zyzj":Detail_bmd,
            "bl":Detail_bmd,
            "gyl":Detail_gyl,
            "ygd":Detail_ygd,
            "jyd":Detail_jyd
        }
        let Detail = product_map[this.props.product];
        return (
            // <div>{this.props.orderNo}</div>
            <Detail orderNo={this.props.orderNo} auditShow={false} type={this.props.product} urlType={this.props.urlType} />
        )
    }
}

export default Particulars;