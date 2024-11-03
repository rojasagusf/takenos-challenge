import { Table, Model, Column, DataType, HasMany } from 'sequelize-typescript';
import Transaction from './transaction.model';

@Table({
  timestamps: true,
  tableName: 'users',
  underscored: true,
})

export default class User extends Model {
  @Column({
    type: DataType.STRING(100),
    primaryKey: true,
  })
    id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    email!: string;

	@Column({
	  type: DataType.STRING,
	  allowNull: false
	})
	  password!: string;

	@HasMany(() => Transaction)
	  transactions!: Transaction[];
}