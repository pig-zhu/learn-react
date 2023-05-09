import Welcome from '../components/Welcome'
import Calculator from '../components/Calculator'
import Clock from '../components/Clock'
import Square from '../components/Square/Square'
import NotFound from '../components/notfound'
import Sheep from '../components/Sheep/index'
const routes = [
    {
        name: '首页',
        path: '/',
        element: <Welcome />
    },
    {
        name: '温度示例',
        path: '/calculator',
        element: <Calculator />
    },
    {
        name: '时间示例',
        path: '/clock',
        element: <Clock />
    },
    {
        name: '井字示例',
        path: '/square',
        element: <Square />
    },
    {
        name: '羊了个兔',
        path: '/sheep',
        element: <Sheep />
    },
    {
        name: '404',
        path: '/404',
        hideden: true,
        element: <NotFound />
    }
]
export default routes