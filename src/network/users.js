import axios from './axios'

export function getUserList(query,pagenum,pagesize){
    
    return axios({
        url:'users',
        methods:'get',
        params:{
            query,
            pagenum,
            pagesize
        }
    })
}