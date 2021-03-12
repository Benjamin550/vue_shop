import axios from './axios'

export function getUserList(query,pagenum,pagesize){
    return axios({
        url:'/users',
        method:'get',
        params:{
            query:'',
            pagenum:1,
            pagesize:2
        },
    })
}