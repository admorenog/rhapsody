import Model from '../../core/system/models/Model'

export default class Graph extends Model
{
	driver = 'sqlite';
	database = 'rhapsody';
	table = 'graph';
}