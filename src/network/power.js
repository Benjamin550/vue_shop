import axios from './axios'
export function getRightsList(){
    return axios({
        url:'rights/list',
        method:'get'
    })
}
export function getRolesList(){
    return axios({
        url:'roles',
        method:'get',
    })
}
