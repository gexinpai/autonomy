import antdIcons from './antdIcons';
import { getSaveLocation } from './helper.js';

export const findItemById = (arr, id) => {
  for (let i in arr) {
    let item = arr[i];
    if (item.id === id) {
      return item;
    }
    if (item.children) {
      let value = findItemById(item.children, id);
      if (value) return value;
    }
  }
};

/**
 * 只搜索类型为file的
 * @param {} arr
 * @param {*} ids
 * @param {*} result
 */
export const findItemsByIds = (arr, ids, result = []) => {
  result.push(
    ...arr.filter((item) => {
      if (item.children) {
        findItemsByIds(item.children, ids, result);
        return false;
      }
      return ids.find((id) => item.id === id);
    })
  );

  return result;
};

/**
 * 只搜索类型为file的
 * @param {} arr
 * @param {*} ids
 * @param {*} result
 */
export const getChildrenFilePath = (arr, result = []) => {
  // result.push(
  arr.forEach((item) => {
    if (item.children) {
      return getChildrenFilePath(item.children, result);
    }
    result.push(item.path);
    // return item.path;
  });
  // );

  return result;
};

export const editItemById = (arr, id, data) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === id) {
      arr[i] = { ...arr[i], ...data };
      break;
    } else if (arr[i].children) {
      editItemById(arr[i].children, id, data);
    }
  }
  return [...arr];
};
export const importChildren = (arr, id, data) => {
  for (let i = 0; i < arr.length; i++) {
    if (!arr[i].children) return;
    if (arr[i].id === id) {
      arr[i].children = arr[i].children.concat(data);
      break;
    } else {
      importChildren(arr[i].children, id, data);
    }
  }
  return [...arr];
};
//  递归多次 return;
export const deleteItemById = (arr, id) => {
  for (let i = 0; i < arr.length; i++) {
    arr = arr.filter((item) => item.id !== id);
    if (arr[i].children) {
      let len = arr[i].children.length;
      arr[i].children = arr[i].children.filter((item) => item.id !== id);
      if (arr[i].children.length < len) {
        break;
      }
      deleteItemById(arr[i].children, id);
    }
  }
  return [...arr];
};

export const createItemByFatherId = (arr, fatherId, data) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === fatherId) {
      arr[i].children = [...(arr[i].children || []), data]; // .push(data);
      break;
    }
    if (arr[i].children) {
      createItemByFatherId(arr[i].children, fatherId, data);
    }
  }
  return [...arr];
};

export const switchFileIcons = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    if (typeof arr[i].icon === 'string') {
      arr[i].icon = antdIcons[arr[i].icon];
    }
    arr[i].selectable = arr[i].isLeaf || false;
    if (arr[i].children) {
      switchFileIcons(arr[i].children);
    }
  }
  return [...arr];
};
export const deleteExtraAttr = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    if (typeof arr[i].icon === 'string') {
      delete arr[i].isLoaded;
      delete arr[i].body;
    }
    if (arr[i].children) {
      deleteExtraAttr(arr[i].children);
    }
  }
  return [...arr];
};

export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};
const savedLocation = getSaveLocation();
const isDevelop = true;
export const initAllFiles = (files = [], defaultFiles = []) => {
  return defaultFiles
    .filter((item) => isDevelop || item.status !== 'develop')
    .map((item) => {
      const [file] = files.filter((ite) => ite.id === item.id);
      return {
        ...item,
        ...file,
        isLeaf: item.isLeaf,
      };
    });
};

export const defaultFiles = [
  // {
  //   sort: 0,
  //   id: 'autonomy',
  //   title: '自治领',
  //   key: 'autonomy',
  //   type: 'note',
  //   icon: 'WalletFilled',
  //   children: [],
  // },
  {
    sort: 1,
    id: 'note',
    title: '笔记',
    status: 'develop',
    key: 'note',
    type: 'note',
    icon: 'WalletFilled',
    children: [],
  },
  {
    sort: 2,
    id: 'todo',
    title: '清单',
    status: 'develop',
    key: 'todo',
    type: 'todo',
    icon: 'CheckCircleFilled',
    children: [
      {
        id: '05',
        title: '今天',
        key: '0-0-1',
        type: 'todo',
        icon: 'AimOutlined',
        path: `${savedLocation}todo/today.json`,
        isLeaf: true,
      },
      {
        id: '04',
        title: '未来七天',
        key: '0-0-2',
        type: 'todo',
        icon: 'CalendarOutlined',
        path: `${savedLocation}todo/week.json`,
        isLeaf: true,
      },
      {
        id: '03',
        title: '待整理',
        key: '0-0-3',
        type: 'todo',
        icon: 'QuestionCircleOutlined',
        path: `${savedLocation}todo/question.json`,
        isLeaf: true,
      },
      {
        id: '01',
        title: '已完成',
        key: '0-0-4',
        type: 'todo',
        icon: 'CheckCircleOutlined',
        path: `${savedLocation}todo/done.json`,
        isLeaf: true,
      },
      {
        id: '02',
        title: '自定义',
        key: '0-0-5',
        type: 'todo',
        icon: 'FolderOutlined',
        isLeaf: false,
      },
    ],
  },
  {
    sort: 3,
    id: 'aim',
    title: '打卡',
    status: 'develop',
    key: 'aim',
    type: 'aim',
    icon: 'CarryOutFilled',
    children: [
      // {
      //   id: '011',
      //   title: '测试',
      //   key: '011',
      //   type: 'aim',
      //   icon: 'FolderOutlined',
      //   isLeaf: false,
      // },
    ],
  },
  // {
  //   sort: 3,
  //   id: 'photo',
  //   title: '自拍壁纸',
  //   status: 'develop',
  //   key: 'photo',
  //   type: 'photo',
  //   icon: 'ThunderboltFilled',
  //   isLeaf: false,
  // },
  {
    sort: 4,
    id: 'amount',
    title: '记账本',
    status: 'develop',
    key: 'amount',
    type: 'amount',
    icon: 'DollarCircleFilled',
    children: [
      // {
      //   id: '01044',
      //   title: 'leaf 1-0',
      //   key: '0-4-0',
      //   type: 'amount',
      //   icon: 'AccountBookOutlined',
      //   isLeaf: true,
      // },
    ],
  },
  {
    sort: 5,
    id: 'music',
    status: 'develop',
    title: '天禅乐',
    key: 'music',
    type: 'music',
    icon: 'CustomerServiceOutlined',
    isLeaf: true,
  },
  // {
  //   sort: 6,
  //   id: 'import',
  //   status: 'develop',
  //   title: '导入',
  //   key: 'import',
  //   type: 'import',
  //   icon: 'ThunderboltFilled',
  //   isLeaf: true,
  // },
  {
    sort: 7,
    id: 'crash',
    title: '回收站',
    status: 'develop',
    key: 'crash',
    type: 'crash',
    icon: 'DeleteFilled',
    isLeaf: true,
  },
  {
    sort: 8,
    id: 'setting',
    title: '设置',
    key: 'setting',
    type: 'setting',
    icon: 'SettingFilled',
    isLeaf: true,
  },
];

export const defaultKeys = [
  'autonomy',
  'note',
  'aim',
  'todo',
  'amount',
  'music',
  'crash',
  'setting',
];
export const noInportKeys = ['setting', 'crash'];
export const noDeleteKeys = ['autonomy', 'setting', 'crash'];

export const getIconByFileType = (type, isLeaf) => {
  if (!isLeaf) {
    return 'FolderOutlined';
  }
  switch (type) {
    case 'todo':
      return 'CheckCircleOutlined';
    case 'note':
      return 'FileMarkdownOutlined';
    case 'aim':
      return 'ProfileOutlined';
    case 'amount':
      return 'AccountBookOutlined';
    default:
      return 'ProfileOutlined';
  }
};
