import React, { Component } from 'react';
import {connect} from 'react-redux';
import { CLASSES } from '../../constants/CharacterConstants';
import COLORS from '../../constants/Colors';
import BarbarianIcon from '../../assets/imgs/class-icons/barbarian-icon.png';
import BardIcon from '../../assets/imgs/class-icons/bard-icon.png';
import ClericIcon from '../../assets/imgs/class-icons/cleric-icon.png';
import DruidIcon from '../../assets/imgs/class-icons/druid-icon.png';
import FighterIcon from '../../assets/imgs/class-icons/fighter-icon.png';
import MonkIcon from '../../assets/imgs/class-icons/monk-icon.png';
import PaladinIcon from '../../assets/imgs/class-icons/paladin-icon.png';
import RangerIcon from '../../assets/imgs/class-icons/ranger-icon.png';
import RogueIcon from '../../assets/imgs/class-icons/rogue-icon.png';
import SorcererIcon from '../../assets/imgs/class-icons/sorcerer-icon.png';
import WarlockIcon from '../../assets/imgs/class-icons/warlock-icon.png';
import WizardIcon from '../../assets/imgs/class-icons/wizard-icon.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { feedCharacter, removeFromParty, addPartyMember } from '../../redux/actions/characterActions';
import KoboldioCard from '../Generics/KoboldioCard';

const _ = require("lodash");

class PartyDashboard extends Component {
    constructor(props){
        super(props);
        this.state = { };

        // internal methods
        this._printHunger = this._printHunger.bind(this);
        this._feedCharacter = this._feedCharacter.bind(this);
    }

    _printHunger(c) {
        const character = c;
        let hunger = c.hunger;
        // paint color
        let color;
        if (hunger > 85) {
            color = COLORS.SuccessDim;
        } else if (hunger >= 50) {
            color = COLORS.Success;
        } else if (hunger >= 25) {
            color = COLORS.Warning;
        } else {
            color = COLORS.Danger;
        }

        let hungerBits = [];

        // append full bits
        while(hunger >= 25) {
            hungerBits.push(
                <div
                    key={`hunger-bit-${hungerBits.length}`}
                    className="kb-hunger-bit full"
                    style={{
                        backgroundColor: color
                    }}
                />
            );
            hunger -= 25;
        }

        // append partial bit
        let partialWidth = 30 * (hunger /  25);
        if (partialWidth > 30) {
            partialWidth = 30;
        }
        if(hunger > 0) {
            hungerBits.push(
                <div
                    key={`hunger-bit-${hungerBits.length}`}
                    className="kb-hunger-bit partial"
                    onClick={() => {
                        this._feedCharacter(character.id);
                    }}
                    style={{
                        border: `1px solid ${color}`
                    }}
                >
                    <div
                        className="kb-hunger-bit-fill"
                        style={{
                            backgroundColor: color,
                            width: partialWidth
                        }}
                    />
                </div>
            );
        }

        // append empty bits
        let emptyIndex = 0;
        while (hungerBits.length < 4) {
            hungerBits.push(
                <div
                    key={`hungry-bit-empty-${emptyIndex}`}
                    className="kb-hunger-bit empty"
                    onClick={() => {
                        this._feedCharacter(character.id);
                    }}
                />
            );
            emptyIndex += 1;
        }

        return(
            <div
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'row'
                }}
            >
                <div
                    style={{
                        flex: 0.25,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        alignItems: 'center'
                    }}
                    onClick={() => {
                        this._feedCharacter(character.id);
                    }}
                >
                    <FontAwesomeIcon
                        icon="drumstick-bite"
                        className="kb-action-icon"
                        style={{
                            marginRight: 12
                        }}
                    />
                </div>
                <div
                    style={{
                        flex: 0.75
                    }}
                >
                    <div className="kb-hunger-bar">
                        { hungerBits }
                    </div>
                </div>
            </div>  
        );
    }

    _feedCharacter(characterId) {
        this.props.feedCharacter(characterId);
    }

    _printIcon(charClass) {
        let icon;
        if (charClass === CLASSES.Barbarian.name) {
            icon = <img alt="Barbarian" src={BarbarianIcon} className="kb-class-icon" />;
        } else if (charClass === CLASSES.Bard.name) {
            icon = <img alt="Bard" src={BardIcon} className="kb-class-icon" />;
        } else if (charClass === CLASSES.Cleric.name) {
            icon = <img alt="Cleric" src={ClericIcon} className="kb-class-icon" />;
        } else if (charClass === CLASSES.Druid.name) {
            icon = <img alt="Druid" src={DruidIcon} className="kb-class-icon" />;
        } else if (charClass === CLASSES.Fighter.name) {
            icon = <img alt="Fighter" src={FighterIcon} className="kb-class-icon" />;
        } else if (charClass === CLASSES.Monk.name) {
            icon = <img alt="Monk" src={MonkIcon} className="kb-class-icon" />;
        } else if (charClass === CLASSES.Paladin.name) {
            icon = <img alt="Paladin" src={PaladinIcon} className="kb-class-icon" />;
        } else if (charClass === CLASSES.Ranger.name) {
            icon = <img alt="Ranger" src={RangerIcon} className="kb-class-icon" />;
        } else if (charClass === CLASSES.Rogue.name) {
            icon = <img alt="Rogue" src={RogueIcon} className="kb-class-icon" />;
        } else if (charClass === CLASSES.Sorcerer.name) {
            icon = <img alt="Sorcerer" src={SorcererIcon} className="kb-class-icon" />;
        } else if (charClass === CLASSES.Warlock.name) {
            icon = <img alt="Warlock" src={WarlockIcon} className="kb-class-icon" />;
        } else if (charClass === CLASSES.Wizard.name) {
            icon = <img alt="Wizard" src={WizardIcon} className="kb-class-icon" />;
        }

        return(
            <div className="kb-class-icon-wrapper">
                { icon }
            </div>
        )
    }

    render(){
        let characters = this.props.character.characters;
        let party = this.props.character.party ?? [];
        let playerCards = [];
        let partyMemberOptions = [
            <option
                key="party-member-select-empty"
                className="kb-select-item"
                value={undefined}
            >
            </option>
        ];

        for(let i = 0; i < party.length; i++){
            const character = party[i];
            playerCards.push(
                <KoboldioCard
                    key={`character-card-${character.name}`}
                    header={
                        <div style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                            <div 
                                style={{
                                    flex: 0.33
                                }}
                            >
                                { this._printIcon(character.class)}
                            </div>
                            <div
                                style={{
                                    flex: 0.67
                                }}
                            >
                                { character.name.split(' ')[0] }
                            </div>
                        </div>
                    }
                    body={this._printHunger(character)}
                    footer={
                        <div
                            className="kb-text-btn"
                            onClick={() => {
                                this.props.removeFromParty(character.id);
                            }}
                        >
                            <FontAwesomeIcon
                                icon="window-close"
                                style={{
                                    marginRight: 8
                                }}
                            />
                            Remove from Party
                        </div>
                    }
                />
            );
        }

        characters.forEach((character) => {
            if (!_.find(party, {"id": character.id})) {
                partyMemberOptions.push(
                    <option
                        key={`party-member-select-${character.id}`}
                        className="kb-select-item"
                        value={character.id}
                    >
                        { character.name }
                    </option>
                )
            }
        })

        if (this.props.visible) {
            return(
                <div className="kb-dashboard-tile">
                    <div className="body-tile">
                        <div className="header">
                            Party
                            <div className="tools">
                                {  partyMemberOptions.length > 1 &&
                                    <div style={{
                                        flex: 0.3,
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <FontAwesomeIcon
                                            icon="plus-square"
                                            style={{
                                                fontSize: 12,
                                                marginRight: 12
                                            }}
                                        />
                                        <select
                                            className="kb-select small"
                                            onChange={(e) => {
                                                this.props.addPartyMember(Number(e.target.value));
                                            }}
                                        >
                                            {
                                                partyMemberOptions
                                            }
                                        </select>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="dashboard-section">
                        <div className="kb-card-gallery">
                            {
                                playerCards
                            }
                        </div>
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }
}

const mapStateToProps = (state) => ({
    character: state.character
});

function mapDispatchToProps(dispatch) {
    return {
        feedCharacter: (characterId) => dispatch(feedCharacter(characterId)),
        removeFromParty: (characterId) => dispatch(removeFromParty(characterId)),
        addPartyMember: (characterId) => dispatch(addPartyMember(characterId))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PartyDashboard);