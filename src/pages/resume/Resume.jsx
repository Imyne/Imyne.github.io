import React from 'react';
import PropTypes from 'prop-types';

import { Page, SubPage, Column } from './Layout/Layout.jsx';
import Sidebar from '../../components/Sidebar/Sidebar.jsx';
import Identity from './Identity/Identity.jsx';
import Hook from './Hook/Hook.jsx';
import Experiences from './Experience/Experience.jsx';


import './resume.css';

export default class Resume extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            lang: props.lang,
        };
        this.dataPaths = [
            '/data/resume/sidebar.json',
            '/data/resume/identity.json',
            '/data/resume/hook.json',
            '/data/resume/work-experiences.json',
            '/data/resume/studies.json',
            '/data/resume/hobbies.json',
        ];
        this.changeLocale = this.changeLocale.bind(this);
    }

    // Component lifecycle
    componentDidMount() {
        // Wait for all promises to resolve to merge retreived objects into state.
        Promise
            .all(this.dataPaths.map(c => fetch(c).then(res => res.json())))
            .then((resolve) => {
                this.setState(() => resolve.reduce(
                    (acc, cur) => Object.assign({}, acc, cur),
                ));
            });
    }

    changeLocale(newLang) {
        this.setState({ lang: newLang });
    }

    render() {
        const navigationHandlers = {
            print: window.print,
            changeLangFR: () => this.changeLocale('fr'),
            changeLangEN: () => this.changeLocale('en'),
        };
        return (
            <div className="resumePage">
                <Sidebar
                    lang={this.state.lang}
                    data={this.state.sidebar}
                    handlers={navigationHandlers}
                />
                <div className="resume">
                    <Page format="A4">
                        <SubPage sectionHeight="46mm">
                            <Column colWidth={1}>
                                <Identity
                                    lang={this.state.lang}
                                    data={this.state.identity}
                                />
                            </Column>
                            <Column align="end" colWidth={3}>
                                <Hook
                                    lang={this.state.lang}
                                    data={this.state.hook}
                                />
                            </Column>
                        </SubPage>
                        <SubPage sectionHeight="236mm">
                            <Column id="largeColumn" colWidth={7}>
                                <Experiences
                                    data={this.state.workexp}
                                    lang={this.state.lang}
                                />
                                <Experiences
                                    data={this.state.studies}
                                    lang={this.state.lang}
                                />
                                <Experiences
                                    data={this.state.hobbies}
                                    lang={this.state.lang}
                                />

                        </SubPage>
                    </Page>
                </div>
            </div>
        );
    }
}

Resume.propTypes = {
    lang: PropTypes.oneOf(['en', 'fr']),
};

Resume.defaultProps = {
    lang: 'fr',
};

