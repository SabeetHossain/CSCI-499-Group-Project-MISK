
import { useLocation } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import "../../../assets/React app layout/src/screens/Element/style.css";
export const Element = (): JSX.Element => {


  const [searchParams] = useSearchParams();
  const ticker = searchParams.get('ticker') || '';

  // const location = useLocation();
  // const searchParams = new URLSearchParams(location.search);
  // const ticker = searchParams.get('ticker');
  // interface EventBus {
  //   listeners: { [key: string]: Function[] };
  //   subscribe(eventType: string, callback: Function): void;
  //   publish(eventType: string, data?: any): void;
  // }


  // const [textFieldValue, setTextFieldValue] = useState('Apple inc.');
 
  // useEffect(() => {
  //   const handleTextFieldValueChanged = (newValue: React.SetStateAction<string>) => {
  //     setTextFieldValue(newValue);
  //   };

  //   EventBus.subscribe('textFieldValueChanged', handleTextFieldValueChanged);

  //   return () => {
  //     EventBus.unsubscribe('textFieldValueChanged', handleTextFieldValueChanged);
  //   };
  // }, [])
 
  
  return (
    <><div>
      {/* <Hero onTextFieldChange={handleTextFieldChange} /> */}
    </div><div className="element">
        <div className="div">

          <header className="header">
            <img className="icon" alt="Icon" src="https://i.ibb.co/M6L2Tsj/icon-5.png" />
            <p className="apple-inc">
              <span className="text-wrapper">{ticker}</span>
            </p>
            <div className="icon-2">
              <div className="oval" />
              <div className="oval-2" />
              <div className="oval-3" />
            </div>
          </header>
          <div className="section">
            <div className="card">
              <div className="overlap-group-wrapper">
                <div className="overlap-group">
                  <img className="path" alt="Path" src="https://i.ibb.co/D1LT5QP/path-1.png" />
                  <img className="img" alt="Path" src="https://i.ibb.co/30QVPdV/path-2.png" />
                </div>
              </div>
              <div className="text">
                <p className="span-wrapper">
                  <span className="text-wrapper">9,453.76</span>
                </p>
                <p className="p">
                  <span className="span">Open Price</span>
                </p>
              </div>
            </div>
            <div className="card-2">
              <div className="overlap-group-wrapper">
                <div className="path-wrapper">
                  <img className="path-2" alt="Path" src="https://i.ibb.co/QMsptMX/path-4.png" />
                </div>
              </div>
              <div className="text-2">
                <p className="span-wrapper">
                  <span className="text-wrapper">$2,782,002</span>
                </p>
                <p className="p">
                  <span className="span">Volume</span>
                </p>
              </div>
            </div>
            <div className="card-3">
              <div className="overlap-group-wrapper">
                <div className="overlap-group-2">
                  <img className="path-3" alt="Path" src="https://i.ibb.co/6FVGbKt/path-5.png" />
                  <img className="path-4" alt="Path" src="https://i.ibb.co/yk8N9nS/path-6.png" />
                </div>
              </div>
              <div className="text-3">
                <p className="p">
                  <span className="span">24h High</span>
                </p>
                <p className="span-wrapper">
                  <span className="text-wrapper">782.00</span>
                </p>
                <p className="span-wrapper-2">
                  <span className="text-wrapper-2">+2,6%</span>
                </p>
              </div>
            </div>
            <div className="card-4">
              <div className="overlap-group-wrapper">
                <div className="overlap-group-2">
                  <img className="path-3" alt="Path" src="https://i.ibb.co/tHJRDpC/path-7.png" />
                  <img className="path-5" alt="Path" src="https://i.ibb.co/4YJCn9D/path-8.png" />
                </div>
              </div>
              <div className="text-4">
                <p className="p">
                  <span className="span">24h Low</span>
                </p>
                <p className="span-wrapper">
                  <span className="text-wrapper">982.82</span>
                </p>
                <p className="span-wrapper-3">
                  <span className="text-wrapper-3">-2,4%</span>
                </p>
              </div>
            </div>
          </div>
          <div className="tab-menu">
            <img className="icon-3" alt="Icon" src="https://i.ibb.co/rm2gqjN/icon-6.png" />
            <img className="icon-4" alt="Icon" src="https://i.ibb.co/h7YKKY4/icon-7.png" />
            <img className="icon-5" alt="Icon" src="https://i.ibb.co/pZChqG1/icon-8.png" />
          </div>
          <div className="tab">
            <p className="overview">
              <span className="text-wrapper-4">Overview</span>
            </p>
            <p className="market-stats">
              <span className="span">Sentiment</span>
            </p>
            <p className="financialas">
              <span className="span">Market Stats</span>
            </p>
            <p className="institutional">
              <span className="span">Predictions</span>
            </p>
            <img className="progress-bar" alt="Progress bar" src="https://i.ibb.co/Khbhb8r/progress-bar-1.png" />
          </div>
          <div className="bar-chart">
            <div className="text-5">
              <p className="span-wrapper-4">
                <span className="span">900</span>
              </p>
              <p className="span-wrapper-5">
                <span className="span">700</span>
              </p>
              <p className="span-wrapper-6">
                <span className="span">500</span>
              </p>
              <p className="span-wrapper-7">
                <span className="span">300</span>
              </p>
              <p className="span-wrapper-8">
                <span className="span">100</span>
              </p>
              <p className="span-wrapper-9">
                <span className="span">0</span>
              </p>
            </div>
            <img className="line" alt="Line" src="https://i.ibb.co/6rBdH1Z/line-1.png" />
            <div className="overlap">
              <img className="line-2" alt="Line" src="https://i.ibb.co/55wvcxR/line-7.png" />
              <img className="line-3" alt="Line" src="https://i.ibb.co/55wvcxR/line-7.png" />
              <img className="line-4" alt="Line" src="https://i.ibb.co/55wvcxR/line-7.png" />
              <div className="div-wrapper">
                <div className="overlap-group-3">
                  <p className="span-wrapper-10">
                    <span className="text-wrapper-5">$200</span>
                  </p>
                  <p className="span-wrapper-11">
                    <span className="text-wrapper-5">%1.9</span>
                  </p>
                </div>
              </div>
              <img className="line-5" alt="Line" src="https://i.ibb.co/55wvcxR/line-7.png" />
              <img className="line-6" alt="Line" src="https://i.ibb.co/55wvcxR/line-7.png" />
              <img className="line-7" alt="Line" src="https://i.ibb.co/NV98R97/line-8.png" />
              <img className="line-8" alt="Line" src="https://i.ibb.co/ftxLv7w/line-9.png" />
            </div>
            <img className="line-9" alt="Line" src="https://i.ibb.co/55wvcxR/line-7.png" />
          </div>
          <div className="navbar">
            <p className="hour">
              <span className="text-wrapper-6">Hour</span>
            </p>
            <p className="day">
              <span className="text-wrapper-6">Day</span>
            </p>
            <div className="month">
              <p className="month-2">
                <span className="text-wrapper-5">Month</span>
              </p>
            </div>
            <p className="element-month">
              <span className="text-wrapper-6">6 Month</span>
            </p>
            <p className="yearly">
              <span className="text-wrapper-6">Yearly</span>
            </p>
            <p className="all">
              <span className="text-wrapper-6">All</span>
            </p>
          </div>
          <div className="overlap-wrapper">
            <div className="month-wrapper">
              <p className="month-3">
                <span className="text-wrapper-5">Subscribe</span>
              </p>
            </div>
          </div>
        </div>
      </div></>
  );
};
 

