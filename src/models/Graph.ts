import Model from '../../core/system/models/Model'

export default class Graph extends Model
{
	protected driver = 'sqlite';
	protected databaseName = 'rhapsody';
	protected tableName = 'graph';
}