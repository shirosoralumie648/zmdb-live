import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { App } from './App';
import { Home } from './home/Home';
import { Settings } from './Settings';
import { AdminPanel } from './admin/AdminPanel';
import { OrganizationManagement } from './admin/OrganizationManagement';
import { AuthorManagement } from './admin/AuthorManagement';
import { SubtitleEditor } from './admin/SubtitleEditor';
import { ClipManagement } from './admin/ClipManagement';
import { SystemSettings } from './admin/SystemSettings';
import { DataAnalytics } from './admin/DataAnalytics';
import reportWebVitals from './reportWebVitals';
import { Login } from './Login';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.Fragment>
        <CssBaseline />
        <BrowserRouter forceRefresh={true} >
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/' element={<App />}>
                    <Route index element={<Home />} />
                    <Route path='/organizations/:organizationId' element={<Home />} />
                    <Route path='/settings' element={<Settings />} />
                    <Route path='/admin' element={<AdminPanel />} />
                    <Route path='/admin/organizations' element={<OrganizationManagement />} />
                    <Route path='/admin/authors' element={<AuthorManagement />} />
                    <Route path='/admin/subtitles' element={<SubtitleEditor />} />
                    <Route path='/admin/clips' element={<ClipManagement />} />
                    <Route path='/admin/system' element={<SystemSettings />} />
                    <Route path='/admin/analytics' element={<DataAnalytics />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </React.Fragment>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log);
