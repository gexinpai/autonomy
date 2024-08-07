import React, { useState } from 'react';
import styles from './Task.less';
import { Draggable } from 'react-beautiful-dnd';
import { Checkbox, Tag, Card } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import SmallRate from './SmallRate';

const Task = ({ columnId, task, index, onCollapseChange, onCheckLittleTask, ...restProps }) => {
  console.log('task.items==>', task);
  // const [collapse, setCollapse] = useState(task.collapse||true);
  const progress = task?.items?.length>0? task?.items?.filter(ite=>ite.checked).length + '/' + task?.items?.length: '';
  const handleCollapse=(e)=>{
    e.stopPropagation();
    // setCollapse(!collapse)
    onCollapseChange(!task.collapse)
  }
  return (
    <Draggable
      key={task.id}
      draggableId={task.id}
      index={index}
      // isDragDisabled={isDragDisabled}
    >
      {(provided) => {
        //snapshot.isDragging
        return (
          <Card
            className={styles.taskCard}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            bodyStyle={{ padding: '8px 8px 8px 12px' }}
          >
            <div
              key={task.id}
              className={`context_menu_task ${styles.Task}`}
              // 注意不要覆盖 draggableProps.style
              data-task={JSON.stringify(task)}
              data-columnid={columnId}
              {...restProps}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {/* <div
                  className={`${styles.important_line}`}
                  style={{ width: `${task.rate * 25}%` }}
                />
                <span className={styles.divider} style={{ left: '25%' }} />
                <span className={styles.divider} style={{ left: '50%' }} />
                <span className={styles.divider} style={{ left: '75%' }} /> */}
                <SmallRate count={4} value={task.rate || 0} />
                <div className={styles.content}>{task.content}</div>
                {
                  task?.items?.length>0&&
                  <span className={styles.collapseIcon} onClick={handleCollapse}>
                  {progress}
                  {
                    task.collapse ? <DownOutlined className="icon"/>: <UpOutlined className="icon"/>
                  }
                </span>
                }
              </div>
              {
                !task.collapse&&
                <>
                  {/* <div className={styles.tips}>{task.desc}</div> */}
                  <div style={{marginTop: 8}}>
                    {task?.items?.map((item, index) => {
                      return (
                        <div key={item.title} className={styles.smallTitle}>
                          <Checkbox
                            size="small"
                            style={{ marginRight: 6 }}
                            checked={item.checked}
                            onChange={({ target }) =>
                              onCheckLittleTask(item, target.checked, index)
                            }
                          ></Checkbox>
                          <div>{item.title}</div>
                        </div>
                      );
                    })}
                  </div>
                  <div className={styles.tags}>
                    {task?.tags?.map((tag) => {
                      return (
                        <Tag key={tag} size="small" onChange={() => {}}>
                          {tag}
                        </Tag>
                      );
                    })}
                  </div>
                </>
              }
            </div>
          </Card>
        );
      }}
    </Draggable>
  );
};
export default Task;
