import { permissions } from "../config/permissions"
export const getTaskByUserId = (tasks, loggedUser) => {

    const result = loggedUser?.role === 2 ? tasks : tasks?.filter(task => task.developpeur._id === loggedUser.id)
    return result
}
export const getPermissions = (pathName, actionName, role) => {
    const exist = permissions.find(permission => permission.name === pathName)
    console.log(exist)
    if (exist) {
        const existAction = exist.actions.find(action => action.name === actionName)

        if (existAction) {
            return existAction.roles.includes(role)
        }
    }
    return false
}
