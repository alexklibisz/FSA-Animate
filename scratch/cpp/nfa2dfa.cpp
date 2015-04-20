/*****************************************************
 Connor Minton
 CS 461
 Project 1: NFA to DFA Converter

 USAGE
   nfa2dfa < (nfa format file)

 OUTPUT
   Writes the DFA format file to standard out.

 Description:   This file defines the entire program which
   converts a given NFA into a DFA. The program reads
   formatted input (the NFA) from stdin and writes formatted
   output (the DFA) to stdout.
******************************************************/
	
#include <iostream>
#include <queue>
#include <set>
#include <iomanip>
#include <cctype>
#include <sstream>
#include <string>
#include <fstream>
#include <algorithm>
#include <vector>
#include <map>
#include <stack>
using namespace std;


// CLASS nfa2dfa
// Wraps the NFA and DFA data, as well as functions to
// print and convert them, into one package.

class nfa2dfa {
private:
	enum {EPSILON = 'E'};
		// epsilon transition

	// SUBCLASS nfa2dfa :: fsa
	// Describes the data structure holding a DFA
	// or NFA

	class fsa {
	public:
		fsa();
		~fsa();

		nfa2dfa * language;
			// defines the nfa2dfa object from which symbols
			// shall be taken (the constructing object by default)

		int start;
			// start state ID

		vector<int> end;
			// accepting state IDs

		map<int, map<char, vector<int> > > transitions;
			// transitions[id]['a'] returns indexes of destination states from [id] under 'a'
		
		int numstates;
			//total number of states
		//-------------------------------

		vector<int> eclosure(vector<int> nodes);
			// epsilon closure of states in [nodes]

		void add_to_state(int id, char input, int nextid);
			//if id not exist, create state entity
			//[input] is an edge from source [id]
			//[nextid] is a state destination

		void print();
			// prints representation of fsa to stdout
	};

public:
	nfa2dfa() {
		nfa.language = this;
		dfa.language = this;
	}
	~nfa2dfa();

private:
	fsa nfa;	//input
	fsa dfa;	//output

	vector<char> inputs;
		//input symbols defined by language
		//epsilon <=> 'E'

public:
	void add_to_nfa(int id, char input, int nextid) {
		nfa.add_to_state(id, input, nextid);
	}	//public interface

	void add_to_dfa(int id, char input, int nextid) {
		dfa.add_to_state(id, input, nextid);
	}	//public interface

	void add_final(int id);
		//designate [id] as final state 

	void set_numstates(int n) {nfa.numstates = n;}

	void set_initial(int id) {nfa.start = id;}

	void set_inputs(vector<char> v);
		// make v the set of possible inputs

	void convert();
		// Converts the stored NFA into a DFA and
		// stores it in [dfa]

	//output functions:
	void print_nfa() { nfa.print(); }
	void print_dfa() { dfa.print(); }
};

/**********************
  FUNCTION DEFINITIONS
***********************/

//------------------
// SUBCLASS nfa2dfa :: fsa
//------------------

nfa2dfa::fsa::fsa() { }

nfa2dfa::fsa::~fsa() { }

vector<int> nfa2dfa::fsa::eclosure(vector<int> nodes) {
	stack<int> s;
	vector<int>::iterator i=nodes.begin();
	vector<int> ec_states;

	// Initialize ec_states
	for (int i=0; i<nodes.size(); i++)
		ec_states.push_back(nodes[i]);

	// Push ec_states onto stack [s]
	for (; i!=nodes.end(); ++i)
		s.push(*i);


	while (!s.empty()) {
		int ext_node;
		int cur_node = s.top();
		s.pop();
		vector<int> e_nodes;

		//fill e_nodes with states reachable by epsilon transition from cur_node
		for (int i=0; i<transitions[cur_node][EPSILON].size(); i++)
			e_nodes.push_back(transitions[cur_node][EPSILON][i]);

		// for each of those states:
		for (int i=0; i<e_nodes.size(); i++) {
			// if the state is not in ec_states...
			if (find(ec_states.begin(), ec_states.end(), e_nodes[i]) == ec_states.end()) {
				ec_states.push_back(e_nodes[i]);
				s.push(e_nodes[i]);
			}
		}
	}

	return ec_states;
}

void nfa2dfa::fsa::add_to_state(int id, char input, int nextid) {
	// First check if base state [id] exists in [transitions]
	if (transitions.find(id) == transitions.end()) {
		transitions[id] = map<char, vector<int> >();
	} 
	// Then check for [input] existence
	if (transitions[id].find(input) == transitions[id].end()) {
		transitions[id][input] = vector<int>();
	}
	// Finally we can update the entity
	transitions[id][input].push_back(nextid);
}

//------------------------
// CLASS nfa2dfa
//------------------------

nfa2dfa::~nfa2dfa() { }

void nfa2dfa::add_final(int id) {
	nfa.end.push_back(id);
}

void nfa2dfa::set_inputs(vector<char> v) {
	for (int i=0; i<v.size(); i++)
		inputs.push_back(v[i]);
}

void nfa2dfa::convert() {
	int next_id = 1;
	dfa.start = 1;
	dfa.numstates = 0;
	queue<int> unmarked;
		// unmarked DFA states
	map<int, vector<int> > dstate_to_nset;
		// performs translation from DFA ID to NFA IDs

	// Use set of symbols minus EPSILON
	vector<char> real_inputs;
	for (int i=0; i<inputs.size(); i++)
		if (inputs[i] != EPSILON) real_inputs.push_back(inputs[i]);

	// Add epsilon closure of start state to DFA
	{
		vector<int> v_state;
		v_state.push_back(nfa.start);
		vector<int> v_close = nfa.eclosure(v_state);
		sort(v_close.begin(), v_close.end());
			//***Must maintain sorted order to check for equivalence later on...

		//iterate through nfa.end
		//check v_close for element of nfa.end (i.e. accepting state)
		for (int j=0; j<nfa.end.size(); j++) {
			if (find(v_close.begin(), v_close.end(), nfa.end[j])
					!= v_close.end()) {
				dfa.end.push_back(next_id);
				break;
			}
		}

		unmarked.push(next_id);
		dstate_to_nset[next_id] = v_close;
			// add set to ID map

		next_id++;
		dfa.numstates++;
	}

	while (!unmarked.empty()) {
		int cur_state = unmarked.front();
		unmarked.pop();

		// for each input symbol...
		for (int i=0; i < real_inputs.size(); i++) {
			vector<int> nfa_states = dstate_to_nset[cur_state];
				// get set of NFA states from DFA ID

			// get set of moves from nfa_states under input symbol:
			set<int> set_move;
			for (int j=0; j < nfa_states.size(); j++) {
				vector<int> node_reach = nfa.transitions[nfa_states[j]][real_inputs[i]];
				for (int k=0; k < node_reach.size(); k++) {
					set_move.insert(node_reach[k]);
				}
			}

			// 
			vector<int> v_move(set_move.size());
			copy(set_move.begin(), set_move.end(), v_move.begin());
			vector<int> v_close = nfa.eclosure(v_move);
			sort(v_close.begin(), v_close.end());

			if (v_close.empty()) continue;
				// avoids adding an empty set to the DFA
				// (future empty sets will match with the associated ID)

			//search dstate_to_nset for v_close
			map<int, vector<int> >::iterator iter;
			for (iter = dstate_to_nset.begin(); iter != dstate_to_nset.end(); ++iter) {
				if (iter->second == v_close) break;
			}

			// if set of NFA IDs cannot be found in the DFA...
			if (iter == dstate_to_nset.end()) {
				// Check epsilon closure for elements in nfa.end
				// i.e. those that are accepting states
				for (int j=0; j<nfa.end.size(); j++) {
					if (find(v_close.begin(), v_close.end(), nfa.end[j])
							!= v_close.end()) {
						dfa.end.push_back(next_id);
						break;
					}
				}

				unmarked.push(next_id);
				dstate_to_nset[next_id] = v_close;
				add_to_dfa(cur_state, real_inputs[i], next_id);
					// add it
				dfa.numstates++;
				next_id++;
			}
			else {	// else, just update existing state with new transition
				add_to_dfa(cur_state, real_inputs[i], iter->first);
			}
		}
	}
}

void nfa2dfa::fsa::print() {
	// HEADER ================================================
	cout << "Initial State:\t" << start << endl;
	cout << "Final States:\t{";
	for (int i=0; i<end.size(); i++) {
		if (i!=0) cout << ",";
		cout << end[i];
	}
	cout << "}" << endl;
	cout << "Total States:\t" << numstates << endl;
	// =======================================================

	// TABLE =================================================
	cout << left << setw(8) << "State";
	for (int i=0; i<language->inputs.size(); i++)
		cout << setw(15) << language->inputs[i];
	cout << endl;
	for (int state=1; state<=numstates; state++) {
		cout << setw(8) << state;
		for (int i=0; i<language->inputs.size(); i++) {
			vector<int> v = transitions[state][language->inputs[i]];
			stringstream ss;
			ss << "{";
			for (int j=0; j<v.size(); j++) {
				if (j!=0) ss << ",";
				ss << v[j];
			}
			ss << "}";
			cout << setw(15) << ss.str();
		}
		cout << endl;
	}
	// =======================================================
}

int main(int argc, char* argv[]) {
	int init, total, buffint;
	string buf;
	char c;
	stringstream ss;
	vector<char> states;
	stack<int> transitions;
	vector<int> final;

	//create nfa2dfa object:
	nfa2dfa converter;

	//get initial state
	cin.get(c);
	while (!isdigit(c))
		cin.get(c);
	cin.putback(c);
	cin >> init;
	converter.set_initial(init);	//set

	//get final states
	cin.get(c);
	while (c != '{')
		cin.get(c);
	cin.get(c);
	while (c != '}') {
		if (isdigit(c)) {
			cin.putback(c);
			cin >> buffint;
			final.push_back(buffint);
			converter.add_final(buffint);
		}
		cin.get(c);
	}

	//get total number of states
	cin.get(c);
	while (!isdigit(c))
		cin.get(c);
	cin.putback(c);
	cin >> total;
	converter.set_numstates(total);		//set

	//get state types
	cin >> buf;
	cin.get(c);
	while (true) {
		if (isalpha(c))
			states.push_back(c);
		else if (c == '\n')
			break;
		cin.get(c);
	}
	converter.set_inputs(states);	//set

	//read transitions
	for (int statenum=1; statenum<=total; statenum++) {
		int actual_statenum;
		getline(cin, buf);
		ss << buf;
		ss >> actual_statenum;	
		for (int i=0; i<states.size(); i++) {
			ss.get(c);
			while (c != '{')
				ss.get(c);
			while (c != '}') {
				if (isdigit(c)) {
					ss.putback(c);
					ss >> buffint;
					converter.add_to_nfa(actual_statenum, states[i], buffint);	//set
				}
				ss.get(c);
			}
		}
		ss.clear();
	}
	//======================================================

	//CONVERT NFA TO DFA
	converter.convert();

	//PRINT DFA:
	converter.print_dfa();
}
