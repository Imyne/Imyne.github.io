import React from "react";
import ReactDOM from "react-dom";

import { Page, SubPage, Column } from "./Layout/Layout";
import Sidebar from "./Sidebar/Sidebar";
import Identity from "./Identity/Identity";
import Hook from "./Hook/Hook";
import Experiences from "./Experience/Experience";
import Skills from "./Skill/Skill";

import "./resume.css"

export default class Resume extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            lang: props.lang,
        };

        let dataPaths = [
            "/data/resume/sidebar.json",
            "/data/resume/identity.json",
            "/data/resume/hook.json",
            "/data/resume/work-experiences.json",
            "/data/resume/studies.json",
            "/data/resume/hobbies.json",
            "/data/resume/skills.json",
        ];

        Promise.all(dataPaths.map((c) => fetch(c).then(res => res.json())))
            .then((resolve) => {
                this.setState((previousState) => resolve.reduce(
                    (acc, cur) => Object.assign({}, acc, cur)
                ))
            });

        // Some react ugliness
        this.changeLocale = this.changeLocale.bind(this);
    }

    changeLocale(newLang) {
        this.setState({ lang: newLang })
    }

    render() {
        console.log(this.state);
        return (
            <div className="row resume">
                <div className="col-md-3">
                    <Sidebar
                        lang={this.state.lang}
                        data={this.state.sidebar}
                        handler={this.changeLocale}
                    />
                </div>
                <div className="col-md-9">
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
                                <Experiences data={this.state.workexp} lang={this.state.lang} />
                                <Experiences data={this.state.studies} lang={this.state.lang} />
                                <Experiences data={this.state.hobbies} lang={this.state.lang} />
                            </Column>
                            <Column id="thinColumn" colWidth={5}>
                                <Skills data={this.state.skills} lang={this.state.lang} />
                            </Column>
                        </SubPage>
                    </Page>
                </div>
            </div>
        );
    }
}

Resume.propTypes = {
    lang: React.PropTypes.oneOf(["en", "fr"])
}

Resume.defaultProps = {
    lang: "fr"
}

