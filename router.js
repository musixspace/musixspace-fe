import React from 'react';
import { Switch, Route } from 'react-router';

export default (
    <Switch>
        <Route path='/' />
        <Route path='/about' />
        <Route path='/no_listening_history' />
        <Route path='/readytorock' />
        <Route path='/rolling' />
        <Route path='/insights' />
        <Route path='/insights/toptracks' />
        <Route path='/insights/topartists' />
        <Route path='/insights/surprise' />
        <Route path='/insights/mood' />
        <Route path='/feed' />
        <Route path='/feed/:id' />
        <Route path='/discover' />
        <Route path='/match/:matchHandle' />
        <Route path='/chat' />
        <Route path='/:handle' />
    </Switch>
); 