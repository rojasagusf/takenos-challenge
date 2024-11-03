import { Table, Model, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import User from './user.model';

@Table({
  timestamps: true,
  tableName: 'transactions',
  underscored: true,
})

export default class Transaction extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
    id!: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
    date!: Date;

	@Column({
	  type: DataType.INTEGER,
	  allowNull: false,
	})
	  amount!: number;

	@Column({
	  type: DataType.STRING,
	  allowNull: false,
	})
	  merchant!: string;

	@ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
	  userId!: number;

	@BelongsTo(() => User)
	  user!: User;
}
