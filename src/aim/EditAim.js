import React, { useState, useEffect, ChangeEvent } from 'react';
import { Input, Button, Select, DatePicker, InputNumber } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import styles from './index.less';
import shortid from 'shortid';
import { EAimType } from './initial';

const EditAim = (props) => {
  const { activeFile, onSubmit } = props || {};
  const data =
    typeof activeFile?.body === 'string' && activeFile?.body.length > 0
      ? JSON.parse(activeFile.body)
      : { branchs: [] };
  const [isEditing, setIsEditing] = useState(false);
  // const [title, setTitle] = useState(activeFile.title || '');
  const [desc, setDesc] = useState(data.desc || '');
  const [times, setTimes] = useState(data.times || 0);
  const [startDate, setStartDate] = useState(
    data.startDate || moment().format('YYYYMMDD')
  );
  const [branchs, setBranchs] = useState(
    data.branchs || [{ id: shortid.generate(), name: '' }]
  );
  useEffect(() => {
    setDesc(data.desc || '');
    setTimes(data.times || 0);
    setStartDate(data.startDate || moment().format('YYYYMMDD'));
    setBranchs(data.branchs || []);
  }, [activeFile.id, activeFile.isLoaded]);

  const handleAddBranch = () => {
    branchs?.push({
      id: shortid.generate(),
      name: '',
      desc: '',
      times: 0,
      currentTimes: 0,
    });
    setBranchs([...branchs]);
    if (branchs.length === 1) {
      setTimes(0);
    }
  };

  const handleSubmit = () => {
    onSubmit(activeFile.id, {
      ...data,
      desc,
      times,
      startDate,
      branchs,
    });
    setIsEditing(false);
  };
  const handleBranchChange = (key, e, index) => {
    let newBranchs = [...branchs];
    newBranchs[index][key] = e.target.value;
    setBranchs(newBranchs);
  };
  const setBranchTimes = (num, index) => {
    let newBranchs = [...branchs];
    // console.log(
    //   'xxxtimes',
    //   times,
    //   newBranchs[index],
    //   newBranchs[index].times,
    //   num,
    //   times - newBranchs[index].times + num
    // );
    setTimes(times - (newBranchs[index].times || 0) + num);
    newBranchs[index].times = num;
    setBranchs(newBranchs);
  };
  // console.log(
  //   'editAim',
  //   activeFile,
  //   data,
  //   startDate,
  //   data.startDate || moment().format('YYYYMMDD')
  // );
  // const isEditing = data.id === editId;
  return (
    <div className={styles.EditAim}>
      <div className={styles.formItem}>
        <span className={styles.label}>???????????????</span>
        {/* {isEditing ? (
          <Input
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            style={{ width: '60%' }}
            placeholder="?????????????????????"
          />
        ) : ( */}
        <div className={styles.aimTitle}>
          <span>{activeFile.title}</span>
          <Button
            disabled={isEditing}
            type="text"
            onClick={() => setIsEditing(true)}
          >
            ??????
          </Button>
        </div>
        {/* )} */}
      </div>
      {(isEditing || desc?.length > 0) && (
        <div className={styles.formItem}>
          <span className={styles.label}>?????????</span>
          {isEditing ? (
            <Input.TextArea
              rows={2}
              onChange={(e) => setDesc(e.target.value)}
              value={desc}
              style={{ width: '60%' }}
              placeholder="?????????????????????"
            />
          ) : (
            <div style={{ width: '60%', wordWrap: 'break-word' }}>{desc}</div>
          )}
        </div>
      )}

      {branchs?.map((branch, index) => {
        if (!branch) return null;
        if (!isEditing && !branch.name) return null;
        return (
          <div key={branch.id}>
            <div className={styles.formItem}>
              <span className={styles.label}>??????{index + 1}???</span>
              {isEditing ? (
                <div className={styles.branchTitle}>
                  <Input
                    value={branch.name}
                    onChange={(e) => handleBranchChange('name', e, index)}
                    placeholder="??????????????????"
                  />
                  <div className={styles.branchTimes}>
                    <InputNumber
                      placeholder="????????????"
                      style={{ flex: 1, margin: '0 6px' }}
                      min={0}
                      value={branch.times}
                      onChange={(val) => setBranchTimes(Number(val), index)}
                    />
                    ?????????
                  </div>
                </div>
              ) : (
                <div className={styles.branchTitle}>
                  {branch.name}
                  <span>{branch.times}?????????</span>
                </div>
              )}
            </div>
            {(isEditing || branch?.desc?.length > 0) && (
              <div className={styles.formItem}>
                <span className={styles.label}></span>
                {isEditing ? (
                  <Input.TextArea
                    value={branch.desc}
                    onChange={(e) => handleBranchChange('desc', e, index)}
                    rows={2}
                    style={{ width: '60%' }}
                    placeholder="?????????????????????"
                  />
                ) : (
                  <div style={{ width: '60%' }}>{branch.desc}</div>
                )}
              </div>
            )}
          </div>
        );
      })}
      {isEditing && (
        <div className={styles.formItem}>
          <span className={styles.label}></span>
          <Button
            type="dashed"
            style={{ width: '60%' }}
            onClick={handleAddBranch}
          >
            <PlusOutlined /> ????????????
          </Button>
        </div>
      )}

      <div className={styles.formItem}>
        <span className={styles.label}>???????????????</span>
        <div className={styles.dateTimes} style={{ width: '60%' }}>
          <div style={{ flex: 1 }}>
            {isEditing ? (
              <DatePicker
                value={moment(startDate)}
                onChange={(date) =>
                  setStartDate(moment(date).format('YYYYMMDD'))
                }
                placeholder="????????????"
                style={{ width: 280 }}
              />
            ) : (
              <div>{startDate}</div>
            )}
          </div>
          <div className={styles.times}>
            <span className={styles.label}>????????????</span>
            {isEditing ? (
              <InputNumber
                disabled={branchs?.length > 0}
                style={{ flex: 1, marginRight: 4 }}
                min={0}
                value={times}
                onChange={(val) => setTimes(Number(val))}
              />
            ) : (
              <span style={{ color: 'red', marginRight: 4 }}>{times}</span>
            )}
            ?????????
          </div>
        </div>
      </div>
      {isEditing && (
        <div className={styles.formItem}>
          <span className={styles.label}></span>
          <div style={{ width: '60%', textAlign: 'left' }}>
            <Button
              type="primary"
              style={{ width: 180 }}
              onClick={handleSubmit}
            >
              ??????
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditAim;
