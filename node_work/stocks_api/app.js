import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;
const apiKey = 'Xpp9OKKHqFn1bptpxZXQiDoftNLWckC3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

// 添加CORS支持
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// 修改后的Stocks API路由
app.get('/stocks/:stock', async (req, res) => {
  const stock = req.params.stock.toUpperCase(); // 转换为大写确保匹配

  try {
    const url = `https://api.polygon.io/v3/reference/dividends?ticker=${stock}&apiKey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    
    console.log('API Response:', data); // 调试日志

    if (data.status !== 'OK' || !data.results) {
      return res.status(404).json({ 
        error: 'No dividend data found',
        details: data.status || 'Invalid API response'
      });
    }

    // 过滤只返回请求的股票数据
    const filteredResults = data.results.filter(item => item.ticker === stock);
    
    if (filteredResults.length === 0) {
      return res.status(404).json({ 
        error: `No dividends found for ${stock}`,
        availableTickers: [...new Set(data.results.map(item => item.ticker))]
      });
    }

    // 格式化返回数据
    const responseData = {
      stock: stock,
      count: filteredResults.length,
      dividends: filteredResults.map(item => ({
        amount: item.cash_amount,
        currency: item.currency,
        exDate: item.ex_dividend_date,
        payDate: item.pay_date,
        frequency: `${item.frequency} times per year`,
        type: item.dividend_type
      })),
      mostRecent: {
        amount: filteredResults[0].cash_amount,
        exDate: filteredResults[0].ex_dividend_date,
        payDate: filteredResults[0].pay_date
      }
    };

    res.json(responseData);

  } catch (err) {
    console.error('Error fetching dividends:', err);
    res.status(500).json({ 
      error: 'Internal server error',
      message: err.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});