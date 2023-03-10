import DbResult from '../Models/DbResult'
import { InitModel } from '../Models/InitModel'


export function isInitModel(result : DbResult | InitModel ) : result is InitModel {
    return (result as InitModel).Employees !== undefined;
}