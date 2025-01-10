// assets
import { ChromeOutlined, QuestionOutlined,RadiusBottomleftOutlined ,CopyOutlined, FileSearchOutlined} from '@ant-design/icons';

// icons
const icons = {
  ChromeOutlined,
  QuestionOutlined,
  RadiusBottomleftOutlined,
  FileSearchOutlined,
  CopyOutlined
};

// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //

const support = {
  id: 'support',
  title: 'Funciones',
  type: 'group',
  children: [
    {
      id: 'rutas-gps',
      title: 'Rutas',
      type: 'item',
      url: '/rutas-gps',
      icon: icons.RadiusBottomleftOutlined
    },
    {
      id: 'notificaciones',
      title: 'Notificaciones',
      type: 'item',
      url: '/notificaciones',
      icon: icons.FileSearchOutlined
    },
    {
      id: 'noticias',
      title: 'Noticias',
      type: 'item',
      url: '/noticias',
      icon: icons.CopyOutlined
    },
    
  ]
};

export default support;
