import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { PanelToStatistic } from './panelToStatistic.entity';


/**
 * Перечисление типов панели.
 */
enum PanelType {
    GLOBAL = 'Глобальная',
    LOCAL = 'Личная'
}

/**
 * Перечисление типов панели.
 */
enum GraphType {
    WEEK = '13 недель',
    MONTH = 'Месячные',
    DAY = 'Ежедневные'
}

/**
 * Сущность File.
 * Представляет загруженные файлы
 */
@Entity()
export class ControlPanel {
    /**
     * Уникальный идентификатор.
     * 
     * @remarks
     * Поле автоматически генерируется в формате UUID v4.0.
     * 
     * @example
     * '123e4567-e89b-12d3-a456-426614174000'
     */
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /**
     * Имя файла.
     * 
     * @remarks
     * nullable: false
     * 
     * @example
     * 'photo.jpg'
     */
    @Column({ nullable: false })
    panelName: string;

    /**
     * Тип панели.
     * 
     * @remarks
     * Используется перечисление `PanelType`. По умолчанию установлено значение глобальная(GLOBAL). nullable: false
     */
    @Column({
        type: 'enum',
        enum: PanelType,
        default: PanelType.GLOBAL,
        nullable: false,
    })
    panelType: PanelType;

    /**
     * Тип графиков.
     * 
     * @remarks
     * Используется перечисление `GraphType`. По умолчанию установлено значение ежедневные(DAY). nullable: false
     */
    @Column({
        type: 'enum',
        enum: GraphType,
        default: GraphType.DAY,
        nullable: false,
    })
    graphType: GraphType;

    /**
     * Дата создания записи.
     * 
     * @remarks
     * Поле автоматически заполняется при создании файла.
     * 
     * @example
     * '2024-06-01T12:34:56Z'
     */
    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    /**
     * Дата последнего обновления записи.
     * 
     * @remarks
     * Поле автоматически обновляется при изменении данных файла.
     */
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;


    /**
     * Связь с сущностью 1:M PanelToStatistic.
     */
    @OneToMany(
        () => PanelToStatistic,
        (panelToStatistic) => panelToStatistic.controlPanel,
    )
    panelToStatistics: PanelToStatistic[];
}
