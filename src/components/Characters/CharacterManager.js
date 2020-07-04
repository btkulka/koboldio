import React, { Component } from 'react';
import { connect } from 'react-redux';
import './CharacterManager.css';
import KoboldioAccordionFolder from '../Generics/KoboldioAccordionFolder';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CharacterClient from '../../clients/CharacterClient';
import CharacterCreationForm from '../Forms/CharacterCreationForm';
import { addCharacter, removeCharacter } from '../../redux/actions/characterActions';

class CharacterManager extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isCreatingCharacter: false
        };

        // members
        this.characterClient = new CharacterClient();

        // internal methods
        this._openCreationForm = this._openCreationForm.bind(this);
        this._closeCreationForm = this._closeCreationForm.bind(this);
        this._formatLabel = this._formatLabel.bind(this);
        this._deleteCharacter = this._deleteCharacter.bind(this);
        this._createCharacter = this._createCharacter.bind(this);
    }

    _openCreationForm() {
        this.setState({
            isCreatingCharacter: true
        });
    }

    _closeCreationForm() {
        this.setState({
            isCreatingCharacter: false
        });
    }

    _formatLabel(label) {
        const labelsToReformat = {
            'inParty': 'party member'
        };

        if (labelsToReformat[label] !== undefined){
            return labelsToReformat[label];
        } else {
            return label;
        }
    }

    async _deleteCharacter(character) {
        await this.characterClient.deleteCharacter(character.id);
        this.props.removeCharacter(character.id);
    }

    async _createCharacter(character) {
        character.clockId = this.props.clock.id;
        await this.characterClient.createCharacter(character)
        .then((character) => {
            this.props.addCharacter(character);
            this.setState({
                isCreatingCharacter: false
            });
        });
    }

    render() {
        const filterValues = ['id', 'clockId', 'type'];
        let data = this.props.character.characters;
        data.forEach((character) => {
            character.type = 'character';
        });

        if (this.props.visible) {
            return(
                <div className="kb-resource-manager">
                    <div className="title-box">
                        <div>
                            <h1>
                                Characters
                            </h1>
                        </div>
                        {
                            !this.state.isCreatingLocation && !this.state.isBuildingRoad &&
                            <div className="button-box">
                                <div onClick={this._openCreationForm}>
                                    <div className="kb-text-btn">
                                        <FontAwesomeIcon
                                            className="icon"
                                            icon="plus-square"
                                        />
                                        <span>
                                            Create New Character
                                        </span>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                    <div className="form-box">
                        {
                            this.state.isCreatingCharacter &&
                            <CharacterCreationForm
                                onCancel={this._closeCreationForm}
                                onSubmit={this._createCharacter}
                            />
                        }
                    </div>
                    <div>
                        {
                            this.props.character.characters.length > 0 &&
                            <KoboldioAccordionFolder
                                topLevelKey="name"
                                data={data}
                                labelFormatter={this._formatLabel}
                                config={{
                                    filterValues: filterValues,
                                    itemKeys: { },
                                    onDelete: {
                                        'character': this._deleteCharacter
                                    }
                                }}
                            />
                        }
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }
}

const mapStateToProps = (state) => ({
    character: state.character,
    clock: state.clock
});

function mapDispatchToProps(dispatch) {
    return {
        addCharacter: (character) => dispatch(addCharacter(character)),
        removeCharacter: (id) => dispatch(removeCharacter(id))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CharacterManager);