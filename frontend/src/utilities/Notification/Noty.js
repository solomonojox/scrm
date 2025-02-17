import Noty from 'noty';
import 'noty/lib/noty.css';
import 'noty/lib/themes/mint.css';
import './noty-custom.css'

export const showNotification = (text, type = 'warning') => {
  new Noty({
    text,
    type,
    layout: 'topRight',
    timeout: 3000,
  }).show();
};

